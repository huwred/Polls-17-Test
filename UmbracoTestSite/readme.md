## Test website credentials

user: test<span>@</span>dummy.com

pwd: 1234567890

### Using the Poll in the UI
The poll package comes with a couplle of ViewComponent Views to render it in your views\
<br/>
```cshtml
//Standard ViewComponent using HtmlUmbracoForm
@await Component.InvokeAsync("Polls", new { Model = Model.Value("testPoll") })
//View to use when doing an Ajax post 
@await Component.InvokeAsync("Polls", new { Model = Model.Value("testPoll", Template="Ajax") })

```

<br/>
<img src="/assets/images/poll.png" alt="Screenshot of an active poll rendered in frontend" width="350"/>
<img src="/assets/images/voted.png" alt="Screenshot of an active poll after voting" width="350"/>
