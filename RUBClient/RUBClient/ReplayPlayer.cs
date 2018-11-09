using System;
using System.IO;
using System.Net;
using System.Configuration;
using System.Threading.Tasks;
using System.Diagnostics;
using IWshRuntimeLibrary;
using System.Reflection;

namespace RUBClient
{
    public class ReplayPlayer
    {
        public ulong matchId { get; }
        public string filePath;

        public ReplayPlayer(string uri)
        {
            matchId = ParseURI(uri);
            filePath = null;
        }

        public async Task<bool> DownloadReplay()
        {
            using (var client = new WebClient())
            {
                try
                {
                    var dlString = new Uri($"{ConfigurationManager.AppSettings["Server"]}{string.Format(ConfigurationManager.AppSettings["DownloadUrl"], matchId.ToString())}");
                    var dlPath = $"{ConfigurationManager.AppSettings["DownloadPath"]}NA1-{matchId}.rofl";
                    if(System.IO.File.Exists(dlPath))
                    {
                        filePath = dlPath;
                        return true;
                    }
                    await client.DownloadFileTaskAsync(dlString, dlPath);
                    filePath = dlPath;
                    return true;
                }
                catch(WebException ex)
                {
                    return false;
                }
            }
        }

        public Task<bool> StartReplay()
        {
            if(string.IsNullOrEmpty(filePath))
            {
                return Task.FromResult<bool>(true);
            }

            filePath = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location) + @"\" + filePath;

            var replayname = Path.GetFileNameWithoutExtension(filePath);

            // Get the path of the file executable
            var gamePath = ConfigurationManager.AppSettings["LolPath"];

            if (string.IsNullOrEmpty(gamePath))
            {
                throw new FileNotFoundException("Failed to find League of Legends executable path.");
            }

            // Create a shortcut in the league directory
            var shortcutFile = CreateAlias(gamePath, filePath);

            if (shortcutFile == null)
            {
                throw new IOException("Failed to create replay shortcut.");
            }

            // Run the replay
            var gamefolder = Path.GetDirectoryName(gamePath);
            var shortcutPath = Path.Combine(gamefolder, Path.GetFileNameWithoutExtension(filePath) + ".lnk");
            Process process;
            try
            {
                process = RunReplay(shortcutPath);
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to start League of Legends.", ex);
            }

            process.WaitForExit();

            // Clean up when replay is done

            if (!CleanUp(shortcutPath))
            {
                throw new IOException("Failed to delete created replay shortcut.");
            }

            return Task.FromResult<bool>(true);
        }

        private static bool CleanUp(string shortcutPath)
        {
            try
            {
                System.IO.File.Delete(shortcutPath);
            }
            catch (Exception)
            {
                return false;
            }
            // Delete the shortcut file
            return true;
        }

        private static Process RunReplay(string shortcutPath)
        {
            // Create a new process and run the shortcut
            Process game = new Process();
            game.StartInfo.FileName = shortcutPath;
            try
            {
                game.Start();
            }
            catch (Exception)
            {
                throw;
            }
            game.WaitForExit();
            return game;
        }

        private static IWshShortcut CreateAlias(string execPath, string replayPath)
        {
            var dir = Path.GetDirectoryName(execPath);

            var filepath = Path.Combine(dir, Path.GetFileNameWithoutExtension(replayPath) + ".lnk");
            // Create a new shortcut that launches league and includes replay path

            return CreateShortcut(filepath, execPath, replayPath);
        }

        /// <summary>
        /// Creates shortcuts, modifies shortcuts if exists
        /// </summary>
        /// <param name="shortcutpath"></param>
        /// <param name="execpath"></param>
        /// <param name="replaypath"></param>
        /// <returns></returns>
        public static IWshShortcut CreateShortcut(string shortcutpath, string execpath, string replaypath)
        {
            var shell = new WshShell();
            var shortcut = (IWshShortcut)shell.CreateShortcut(shortcutpath);

            shortcut.Description = "ROFL Player replay shortcut";
            shortcut.TargetPath = execpath;
            shortcut.WorkingDirectory = Path.GetDirectoryName(shortcutpath);
            shortcut.Arguments = "\"" + replaypath + "\"";
            shortcut.Save();

            return shortcut;
        }

        private ulong ParseURI(string uri)
        {
            if(uri.StartsWith("roflmao://match-id/"))
            {
                ulong result;
                if(ulong.TryParse(uri.Substring(19).Replace("/",""), out result))
                {
                    return result;
                }
                else
                {
                    throw new Exception($"Error with parsing match-id: {uri.Substring(19)}");
                }
            }
            else
            {
                throw new Exception($"Malformed URI: {uri}");
            }
        }
    }
}
