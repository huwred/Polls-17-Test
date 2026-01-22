## Test website credentials

user: test<span>@</span>dummy.com

pwd: 1234567890

### Using the Poll in the UI
The poll package comes with a ViewComponent to render it in your views\
<br/>
```@await Component.InvokeAsync("Polls", new { Model = Model.Value("testPoll") })```

<br/>
<img src="/assets/images/poll.png" alt="Screenshot of an active poll rendered in frontend" width="350"/>
<img src="/assets/images/voted.png" alt="Screenshot of an active poll after voting" width="350"/>
