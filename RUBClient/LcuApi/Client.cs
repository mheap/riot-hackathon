using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Management;
using System.Net;
using System.Net.Http;
using System.Net.WebSockets;
using System.Runtime.Remoting.Messaging;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;

namespace LcuApi
{
    internal static class Extensions
    {
        public static string GetCommandLine(this Process process)
        {
            using (var searcher = new ManagementObjectSearcher("SELECT CommandLine FROM Win32_Process WHERE ProcessId = " + process.Id))
            using (var objects = searcher.Get())
            {
                return objects.Cast<ManagementBaseObject>().SingleOrDefault()?["CommandLine"]?.ToString();
            }

        }
    }

    public class Client
    {
        private const string ClientName = @"LeagueClientUx";
        private static readonly Regex InstallDirectoryRegex = new Regex("\"--install-directory=(?<path>[^\"]*)\"");


        public static async Task<Client> Connect()
        {
            while (true)
            {
                var clientProcess = await GetLeagueClientProcess();

                var match = InstallDirectoryRegex.Match(clientProcess.GetCommandLine());
                var installDirectory = match.Groups["path"];

                var lockfile = $"{installDirectory}lockfile";

                if (File.Exists(lockfile))
                {
                    string lockText;
                    using (var lockfileStream = new FileStream(lockfile, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
                    {
                        using (var textStream = new StreamReader(lockfileStream))
                        {
                            lockText = await textStream.ReadToEndAsync();
                        }
                    }

                    var parts = lockText.Split(':');

                    var args = new ClientArgs
                    {
                        Process = parts[0],
                        Pid = int.Parse(parts[1]),
                        Port = ushort.Parse(parts[2]),
                        Password = parts[3],
                        Protocol = parts[4],
                    };

                    var connectionString = $"127.0.0.1:{args.Port}/";
                    var client = new HttpClient
                    {
                        BaseAddress = new Uri($"{args.Protocol}://{connectionString}"),
                        DefaultRequestHeaders =
                        {
                            {
                                "Authorization",
                                $"Basic {Convert.ToBase64String(Encoding.UTF8.GetBytes($"riot:{args.Password}"))}"
                            }
                        }
                    };
                    var socket = new ClientWebSocket();
                    var uri = new Uri($"ws://{connectionString}");
                    socket.Options.UseDefaultCredentials = false;
                    socket.Options.SetRequestHeader("Authorization", $"Basic {Convert.ToBase64String(Encoding.UTF8.GetBytes($"riot:{args.Password}"))}");
                    //await socket.ConnectAsync(uri, CancellationToken.None);

                    return new Client(client, socket);
                }

                await Task.Delay(1000);
            }
        }

        private static async Task<Process> GetLeagueClientProcess()
        {
            while(true)
            {
                var clientProcess = Process
                    .GetProcesses()
                    .FirstOrDefault(process => process.ProcessName == ClientName);

                if (clientProcess != null)
                {
                    return clientProcess;
                }

                await Task.Delay(1000);
            }
        }

        private class ClientArgs
        {
            public string Process { get; set; }
            public int Pid { get; set; }
            public ushort Port { get; set; }
            public string Password { get; set; }
            public string Protocol { get; set; }
        }
        
        private readonly HttpClient _httpClient;
        private Gameflow _gameflow;
        private readonly ClientWebSocket _socket;
        private Login _login;
        private EndOfGame _endOfGame;
        private Replays _replays;

        private Client(HttpClient client, ClientWebSocket socket)
        {
            this._httpClient = client;
            this._socket = socket;
        }

        public Gameflow Gameflow => _gameflow ?? (_gameflow = new Gameflow(this._httpClient));
        public Login Login => _login ?? (_login = new Login(this._httpClient));
        public EndOfGame EndOfGame => _endOfGame ?? (_endOfGame = new EndOfGame(this._httpClient));
        public Replays Replays => _replays ?? (_replays = new Replays(this._httpClient));

        public async Task<bool> GetSwagger()
        {
            var res = await _httpClient.GetAsync("swagger/v2/swagger.json");
            
            GC.KeepAlive(res);
            return true;
        }
    }
}
