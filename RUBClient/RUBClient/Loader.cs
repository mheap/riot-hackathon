using System;
using System.Diagnostics;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Threading;
using LcuApi;
using Newtonsoft.Json;
using RUBClient.Properties;

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

                        using (var uploadClient = new HttpClient())
                        {
                            var res = await uploadClient.PostAsync(
                                $"{Settings.Default["Server"]}{Settings.Default["UploadUrl"]}",
                                new StringContent(
                                    JsonConvert.SerializeObject(stats),
                                    Encoding.UTF8,
                                    "application/json")
                            );

                            if (await PromptForView())
                            {
                                if (res.StatusCode == HttpStatusCode.RedirectMethod)
                                {
                                    var location = res.Headers.Location;

                                    Process.Start(location.ToString());
                                }
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
