using System.Threading.Tasks;
using System.Windows;
using System.Windows.Input;

namespace RUBClient
{
    /// <summary>
    /// Interaction logic for ViewLeaderboardPrompt.xaml
    /// </summary>
    public partial class ViewLeaderboardPrompt : Window
    {
        private readonly TaskCompletionSource<bool> _completionSource = new TaskCompletionSource<bool>();

        public ViewLeaderboardPrompt()
        {
            this.YesCommand = new DelegateCommand(() => this._completionSource.SetResult(true));
            this.NoCommand = new DelegateCommand(() => this._completionSource.SetResult(false));

            InitializeComponent();
        }

        public ICommand YesCommand { get; }

        public ICommand NoCommand { get; }

        public Task<bool> DialogResultAsync => this._completionSource.Task;
    }
}
