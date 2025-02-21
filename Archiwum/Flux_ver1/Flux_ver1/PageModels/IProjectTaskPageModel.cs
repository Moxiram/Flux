using CommunityToolkit.Mvvm.Input;
using Flux_ver1.Models;

namespace Flux_ver1.PageModels
{
    public interface IProjectTaskPageModel
    {
        IAsyncRelayCommand<ProjectTask> NavigateToTaskCommand { get; }
        bool IsBusy { get; }
    }
}