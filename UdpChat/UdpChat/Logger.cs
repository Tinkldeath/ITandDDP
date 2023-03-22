using System;
using static System.Net.Mime.MediaTypeNames;
using System.IO;
using System.Text;

namespace UdpChat
{
	public class Logger
	{
		private int localPort;
		private int remotePort;

		public Logger(int localPort, int remotePort)
		{
			this.localPort = localPort;
			this.remotePort = remotePort;
		}

		public void Log(string message)
		{
			string path = $"{localPort}-{remotePort}.txt";
			string content = Fetch();
			content += message;
            using (StreamWriter newTask = new StreamWriter(path, false))
            {
                newTask.WriteLine(content);
            }
        }

		public string Fetch()
		{
            string path = $"{localPort}-{remotePort}.txt";
			if (File.Exists(path))
			{
                using (FileStream fstream = File.OpenRead(path))
                {
                    // выделяем массив для считывания данных из файла
                    byte[] buffer = new byte[fstream.Length];
                    // считываем данные
                    fstream.Read(buffer, 0, buffer.Length);
                    // декодируем байты в строку
                    string textFromFile = Encoding.Default.GetString(buffer);
                    return textFromFile;
                }
            } else
			{
				File.CreateText(path);
                return "";
            }
        }

	}
}

