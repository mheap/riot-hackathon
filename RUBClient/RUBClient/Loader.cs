using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Threading;
using LcuApi;
using Newtonsoft.Json;

namespace RUBClient
{
    public static class Loader
    {
        public static void Main(string[] args)
        {
            ServicePointManager.ServerCertificateValidationCallback = (sender, certificate, chain, errors) => true;

            if (args.Length == 1)
            {
                AsyncPlay(args).Wait();
                Environment.Exit(1);
            }
            else if (args.Length > 1)
            {
                var collectArg = args.SkipWhile(arg => arg != "--collect").Skip(1).Take(1).First();

                CollectMainAsync(collectArg).Wait();
            }
            else
            {
                AsyncMain(args).Wait();
            }
        }

        private static readonly object _dispatcherLock = new object();
        private static Dispatcher _dispatcher;

        private static Dispatcher MainDispatcher
        {
            get
            {
                if (_dispatcher == null)
                {
                    lock (_dispatcherLock)
                    {
                        if (_dispatcher == null)
                        {
                            using (var startEvent = new ManualResetEventSlim())
                            {
                                var dispatchThread = new Thread(() =>
                                {
                                    startEvent.Set();
                                    Dispatcher.Run();
                                });
                                dispatchThread.TrySetApartmentState(ApartmentState.STA);
                                dispatchThread.Start();

                                startEvent.Wait();
                                Thread.Sleep(10);

                                _dispatcher = Dispatcher.FromThread(dispatchThread);
                                _dispatcher.Invoke(() => { });
                            }
                        }
                    }
                }

                return _dispatcher;
            }
        }

        public static async Task AsyncPlay(string[] args)
        {
            //var client = await Client.Connect();
            var viewer = new ReplayPlayer(args[0]);
            //var downpath = await client.Replays.GetRoflsPath();

            var downloaded = await viewer.DownloadReplay(); //FINISH REPLAYS
            if (downloaded)
            {
                //client.Replays.WatchMatchReplay((long)viewer.matchId);
                Console.WriteLine(viewer.matchId);
                await viewer.StartReplay();
            }
        }

        public static async Task AsyncMain(string[] args)
        {
            try
            {
                var client = await Client.Connect();

                while (true)
                {
                    var state = await client.Gameflow.GetCurrentState();
                    if (state == GameflowState.InProgress)
                    {
                        while (state != GameflowState.EndOfGame && state != GameflowState.None)
                        {
                            await Task.Delay(1000);

                            state = await client.Gameflow.GetCurrentState();
                        }

                        var stats = await client.EndOfGame.GetEndOfGameStats();

                        using (var rubClient = new RUB())
                        {
                            var redirectLocation = await rubClient.GetMatchUrl(stats);

                            if (await PromptForView())
                            {
                                if (!await rubClient.ReplayExists(stats.GameId))
                                {
                                    if (!await client.Replays.DownloadMatchReplay(stats.GameId))
                                    {
                                        continue;
                                    }

                                    var replayFile = $"{await client.Replays.GetRoflsPath()}/NA1-{stats.GameId}.rofl";

                                    while (!File.Exists(replayFile))
                                    {
                                        await Task.Delay(50);
                                    }

                                    if (!await rubClient.UploadReplayForGame(replayFile, stats.GameId, stats.SummonerId))
                                    {
                                        continue;
                                    }
                                }

                                Process.Start(redirectLocation);
                            }
                        }
                    }

                    await Task.Delay(1000);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        private class ChampStats
        {
            public int ChampionId { get; set; }
            public List<CareerStats.ChampionQueueStatsDto> StatsPerPosition { get; set; }
        }

        public static async Task CollectMainAsync(string arg)
        {
            var championIds = await StaticData.GetChampionIds();
            var client = await Client.Connect();

            var allStats = new List<ChampStats>();

            foreach (var championId in championIds)
            {
                var champStats = new ChampStats
                {
                    ChampionId = championId,
                    StatsPerPosition = new List<CareerStats.ChampionQueueStatsDto>(),
                };

                foreach (Position position in Enum.GetValues(typeof(Position)))
                {
                    var stats = await client.CareerStats.GetChampionAverage(
                        championId, 
                        position, 
                        Tier.ALL,
                        Queue.rank5solo);

                    champStats.StatsPerPosition.Add(stats);
                }

                allStats.Add(champStats);
            }

            using(var outFile = File.OpenWrite(arg))
            {
                using (var writer = new StreamWriter(outFile, Encoding.UTF8))
                {
                    var serializeObject = JsonConvert.SerializeObject(allStats, Formatting.Indented);
                    await writer.WriteAsync(serializeObject);
                }
            }
        }

        private static Task<bool> PromptForView()
        {
            var resultSource = new TaskCompletionSource<bool>();
            MainDispatcher.BeginInvoke((Action)(async () =>
            {
                var window = new ViewLeaderboardPrompt();
                //var workingArea = Screen.PrimaryScreen.WorkingArea;

                //window.Left = window.Top = -999999999;
                window.Show();
                
                //window.Left = workingArea.Right - window.Width - 10;
                //window.Top = workingArea.Bottom - window.Height - 10;

                var view = await window.DialogResultAsync;
                
                window.Close();

                resultSource.SetResult(view);
            }));

            return resultSource.Task;
        }
    }
}
