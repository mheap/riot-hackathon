using System;
using System.Windows.Input;

namespace RUBClient
{
    internal class DelegateCommand<T> : ICommand
    {
        private readonly Func<T, bool> _canExecute;
        private readonly Action<T> _execute;

        public DelegateCommand(Action<T> execute) : this(execute, _ => true)
        {
        }

        public DelegateCommand(Action<T> execute, Func<T, bool> canExecute)
        {
            this._execute = execute;
            this._canExecute = canExecute;
        }

        public bool CanExecute(object parameter)
        {
            return this._canExecute((T) parameter);
        }

        public void Execute(object parameter)
        {
            this._execute((T) parameter);
        }

        public void RaiseCanExecuteChanged()
        {
            this.CanExecuteChanged?.Invoke(this, EventArgs.Empty);
        }

        public event EventHandler CanExecuteChanged;
    }

    internal class DelegateCommand : DelegateCommand<object>
    {
        public DelegateCommand(Action execute) : this(execute, () => true)
        {
        }

        public DelegateCommand(Action execute, Func<bool> canExecute) : base(_ => execute(), _ => canExecute())
        {
        }
    }
}
