using System;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Threading;
using LcuApi;

namespace RUBClient
{
    public static class Loader
    {
        public static void Main(string[] args)
        {
            ServicePointManager.ServerCertificateValidationCallback = (sender, certificate, chain, errors) => true;

            AsyncMain(args).Wait();
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
