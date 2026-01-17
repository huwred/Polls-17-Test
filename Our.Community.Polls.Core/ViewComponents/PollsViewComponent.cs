using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using NPoco.fastJSON;
using Our.Community.Polls.Interfaces;
using Our.Community.Polls.Models;
using System;
using System.Text.Json;
using System.Threading.Tasks;
using Umbraco.Cms.Api.Management.Controllers.DynamicRoot;

namespace Our.Community.Polls.ViewComponents
{
    public class Poll
    {
        public string key { get; set; }
        public string value { get; set; }
    }
    public class PollsViewComponent : ViewComponent
    {
        private readonly IPollService _pollservice;
        public PollsViewComponent(IPollService pollservice)
        {
            _pollservice = pollservice;
        }
        public async Task<IViewComponentResult> InvokeAsync(Question? Model,string? Template, JsonDocument? PollJson)
        {
            if(PollJson != null)
            {
                string jsonString = JsonSerializer.Serialize(PollJson);
                List<Poll> polls = JsonSerializer.Deserialize<List<Poll>>(jsonString);
                if(polls != null && polls.Count > 0)
                {
                    int pollKey = Convert.ToInt32( polls[0].key);
                    // Here you can use pollKey as needed
                    Model = _pollservice.GetQuestion(pollKey);
                }
            }
            if (Template != null)
            {
                return await Task.FromResult((IViewComponentResult)View(Template,Model));
            }
            return await Task.FromResult((IViewComponentResult)View(Model));
        }
    }
}
