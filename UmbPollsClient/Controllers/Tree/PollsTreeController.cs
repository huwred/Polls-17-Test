using Asp.Versioning;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Our.Community.Polls.Repositories;
using Umbraco.Cms.Api.Common.ViewModels.Pagination;
using Umbraco.Cms.Api.Management.ViewModels.Tree;

namespace UmbPollsClient.Controllers.Tree;

[ApiVersion("1.0")]
[ApiExplorerSettings(GroupName = "UmbPollsClient")]
public class PollsTreeController : UmbPollsClientApiControllerBase
{
    private readonly IQuestions _questions;
    public PollsTreeController(IQuestions questions)
    {
        _questions = questions;
    }

    [HttpGet("root")]
    [ProducesResponseType(typeof(PagedViewModel<PollTreeItemResponseModel>), StatusCodes.Status200OK)]
    public ActionResult<PagedViewModel<PollTreeItemResponseModel>> GetPolls(CancellationToken token, int skip = 0, int take = 100, bool foldersOnly = false)
    {
        var polls = _questions.Get();

        var items = new List<PollTreeItemResponseModel>();
        foreach (var item in polls) {

            items.Add(new PollTreeItemResponseModel
            {
                Id = item.Id,
                Name = item.Name,
                Icon = "icon-bar-chart",
                HasChildren = false,
                entityType = "Our.Community.Polls.Models.Question"
            });
        }

        return Ok(new PagedViewModel<PollTreeItemResponseModel>
        {
            Items = items,
            Total = items.Count
        });
    }

    [HttpGet("Children")]
    [ProducesResponseType(typeof(PagedViewModel<PollTreeItemResponseModel>), statusCode: StatusCodes.Status200OK)]
    public ActionResult<PagedViewModel<PollTreeItemResponseModel>> GetAnswers(string parent, int skip = 0, int take = 100)
    {
        var poll = _questions.GetAnswers(Convert.ToInt32(parent));

        var items = new List<PollTreeItemResponseModel>();
        for (int n = 0; n < 5; n++)
        {
            items.Add(new PollTreeItemResponseModel
            {
                Id = items[n].Id,
                Name = $"Child Item {n + 1} of {parent}",
                Icon = "icon-star",
                HasChildren = false,
            });
        }
        return Ok(new PagedViewModel<PollTreeItemResponseModel>
        {
            Items = items,
            Total = items.Count
        });
    }

    [HttpGet("Ancestors")]
    [ProducesResponseType(typeof(IEnumerable<PollTreeItemResponseModel>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<PollTreeItemResponseModel>>> GetAncestors(string id)
        => await Task.FromResult(Ok(Enumerable.Empty<PollTreeItemResponseModel>()));
}


public class  PollTreeItemResponseModel : NamedEntityTreeItemResponseModel
{
    public new int Id { get; set; }
    public string Icon { get; set; } = "icon-bar-chart";
    public string? entityType { get; internal set; }
}
