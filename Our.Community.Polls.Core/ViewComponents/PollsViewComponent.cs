using Microsoft.AspNetCore.Mvc;
using Our.Community.Polls.Interfaces;
using Our.Community.Polls.Models;
using System.Text.Json;

namespace Our.Community.Polls.ViewComponents
{
    public class PollsViewComponent : ViewComponent
    {
        private readonly IPollService _pollservice;
        public PollsViewComponent(IPollService pollservice)
        {
            _pollservice = pollservice;
        }
        public async Task<IViewComponentResult> InvokeAsync(Question? Model,string? Template)
        {
            if (Model != null)
            {
                Model = _pollservice.GetQuestion(Model.Id);
            }
            if (Template != null && Model != null)
            {
                return await Task.FromResult((IViewComponentResult)View(Template, Model));
            }
            return await Task.FromResult((IViewComponentResult)View(Model));
        }
    }
}
