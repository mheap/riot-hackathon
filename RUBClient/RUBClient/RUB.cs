﻿using System;
using System.Configuration;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using LcuApi;
using Newtonsoft.Json;

namespace RUBClient
{
    internal class RUB : IDisposable
    {
        private readonly HttpClient _client;

        public RUB()
        {
            this._client = new HttpClient
            {
                BaseAddress = new Uri($"{ConfigurationManager.AppSettings["Server"]}"),
                Timeout = new TimeSpan(0, 0, 30),
            };
        }

        public string GetMatchUrl(long matchid)
        {
            return $"{ConfigurationManager.AppSettings["WebsiteBase"]}/match/{matchid}";
        }

        public async Task<bool> UploadReplayForGame(string replayFile, long gameId, long summonerId)
        {
            using (var replay = File.OpenRead(replayFile))
            {
                var fileData = new MultipartFormDataContent
                {
                    {new StreamContent(replay), "file", replay.Name}
                };

                fileData.Headers.Add("match-id", gameId.ToString());
                fileData.Headers.Add("summoner-id", summonerId.ToString());

                var uploadRes = await this._client.PostAsync(
                    ConfigurationManager.AppSettings["UploadUrl"],
                    fileData);

                return uploadRes.IsSuccessStatusCode;
            }
        }

        public async Task<bool> ReplayExists(long gameId)
        {
            var res = await this._client.GetAsync(string.Format(ConfigurationManager.AppSettings["CheckMatchExistsUrl"], gameId));

            return res.IsSuccessStatusCode;
        }

        public void Dispose()
        {
            _client?.Dispose();
        }
    }
}
