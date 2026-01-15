using Microsoft.AspNetCore.Mvc;
using Our.Community.Polls.Models;
using Our.Community.Polls.Repositories;


namespace Our.Community.Polls.Controllers.ApiControllers
{

    [ApiController]
    public class OverviewApiController : ControllerBase
    {
        private readonly IQuestions _questions;
        private readonly IAnswers _answers;
        private  readonly IResponses _responses;
        public OverviewApiController(IQuestions questions, IAnswers answers, IResponses responses)
        {
            _questions = questions;
            _answers = answers;
            _responses = responses;
        }
        [HttpGet]
        [Route("get-overview")]
        public IEnumerable<Question> Get(int? id)
        {
            var questions = _questions.Get();
            var answers = _answers.Get();
            var responses = _responses.Get();

            foreach (var question in questions)
            {

                var questionAnswers = answers?.Where(answer => answer.QuestionId.Equals(question.Id)).ToList();
                question.Responses = responses.Where(response => response.QuestionId.Equals(question.Id));
                question.ResponseCount = question.Responses.Count();
                foreach (var answer in questionAnswers)
                {
                    var answerResponses = question.Responses.Where(item => item.AnswerId.Equals(answer.Id)).ToList();
                    answer.Responses = answerResponses;
                    answer.Percentage = answerResponses.Any() ? Math.Round((double)(answerResponses.Count) / question.Responses.Count() * 100) : 0;
                }
                question.Answers= questionAnswers;
            }
            if(id == null)
                return questions;

            return questions.Where(question => question.Id == id);
        }
                [HttpGet]
        [Route("get-poll")]
        public Question Get(int id)
        {
            var question = _questions.GetById(id);
            var answers = _answers.Get();
            var responses = _responses.Get();

                question.Answers = answers?.Where(answer => answer.QuestionId.Equals(question.Id));
                question.Responses = responses.Where(response => response.QuestionId.Equals(question.Id));

            return question;
        }
    }
}