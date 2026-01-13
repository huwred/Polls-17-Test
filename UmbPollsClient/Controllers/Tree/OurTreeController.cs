using Asp.Versioning;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Our.Community.Polls.Repositories;
using Umbraco.Cms.Api.Common.ViewModels.Pagination;
using Umbraco.Cms.Api.Management.ViewModels.Tree;

namespace UmbPollsClient.Controllers.Tree;

[ApiVersion("1.0")]
[ApiExplorerSettings(GroupName = "UmbTreeClient")]
public class OurTreeController : UmbTreeClientApiControllerBase
{
    private readonly IQuestions _questions;
    public OurTreeController(IQuestions questions)
    {
        _questions = questions;
    }

    [HttpGet("root")]
    [ProducesResponseType(typeof(PagedViewModel<OurTreeItemResponseModel>), StatusCodes.Status200OK)]
    public ActionResult<PagedViewModel<OurTreeItemResponseModel>> GetPolls(CancellationToken token, int skip = 0, int take = 100, bool foldersOnly = false)
    {
        var polls = _questions.Get();

        var items = new List<OurTreeItemResponseModel>();
        foreach (var item in polls) {

            items.Add(new OurTreeItemResponseModel
            {
                Id = item.Id,
                Name = item.Name,
                Icon = "icon-bar-chart",
                HasChildren = false,
            });
        }

        return Ok(new PagedViewModel<OurTreeItemResponseModel>
        {
            Items = items,
            Total = items.Count
        });
    }

    [HttpGet("Children")]
    [ProducesResponseType(typeof(PagedViewModel<OurTreeItemResponseModel>), statusCode: StatusCodes.Status200OK)]
    public ActionResult<PagedViewModel<OurTreeItemResponseModel>> GetChildren(string parent, int skip = 0, int take = 100)
    {
        var poll = _questions.GetAnswers(Convert.ToInt32(parent));

        var items = new List<OurTreeItemResponseModel>();
        for (int n = 0; n < 5; n++)
        {
            items.Add(new OurTreeItemResponseModel
            {
                Id = items[n].Id,
                Name = $"Child Item {n + 1} of {parent}",
                Icon = "icon-star",
                HasChildren = false,
            });
        }
        return Ok(new PagedViewModel<OurTreeItemResponseModel>
        {
            Items = items,
            Total = items.Count
        });
    }

    [HttpGet("Ancestors")]
    [ProducesResponseType(typeof(IEnumerable<OurTreeItemResponseModel>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<OurTreeItemResponseModel>>> GetAncestors(string id)
        => await Task.FromResult(Ok(Enumerable.Empty<OurTreeItemResponseModel>()));
}


public class  OurTreeItemResponseModel : NamedEntityTreeItemResponseModel
{
    public new int Id { get; set; }
    public string Icon { get; set; } = "icon-bar-chart";
}
