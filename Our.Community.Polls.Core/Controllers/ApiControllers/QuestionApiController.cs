using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Org.BouncyCastle.Ocsp;
using Our.Community.Polls.Core.Converters;
using Our.Community.Polls.Models;
using Our.Community.Polls.Repositories;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.RegularExpressions;
using System.Web;
using Umbraco.Cms.Web.Common.Controllers;
using static Our.Community.Polls.PollConstants.TableConstants;

namespace Our.Community.Polls.Controllers.ApiControllers
{
    public class PollPostDto
    {
        public int Id { get; set; }
        public string Name { get; set; }

        // Repeated form keys: Answers, answerssort, answersid
        public List<string> Answers { get; set; } = new();
        public List<int> AnswersSort { get; set; } = new();
        public List<int> AnswersId { get; set; } = new();

        // HTML input type="date" posts yyyy-MM-dd
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
    [ApiController]
    public class QuestionApiController : ControllerBase 
    {
        private readonly IQuestions _questions;
        private readonly ILogger<QuestionApiController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public QuestionApiController(IQuestions questions,ILogger<QuestionApiController> logger,IHttpContextAccessor httpContextAccessor)
        {
            _questions = questions;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpGet]
        [Route("get-question")]
        public IEnumerable<Question> Get()
        {
            return _questions.Get();
        }

        [HttpGet]
        [Route("get-question/{id}")]
        public Question GetById(int id)
        {
            if(id == -1)
            {
                var question = new Question();
                question.Answers = new List<Answer>();
                question.Responses = new List<Response>();
                return question;

            }
            var result = _questions.GetById(id);

            return result;
        }
        [HttpPost]
        [Route("post-question-form")]
        public async Task<Question?> PostAsync([FromForm] FormCollection form)
        {
            var test = form;
            return null;
        }
        [HttpPost]
        [Route("post-question")]
        public async Task<Question?> PostAsync([FromForm] PollPostDto form)
        {
            if (string.IsNullOrWhiteSpace(form.Name))
                return null;

            var poll = new Question
            {
                Id = form.Id,
                Name = form.Name!.Trim(),
                StartDate = form.StartDate,
                EndDate = form.EndDate,
                CreatedDate = form.CreatedDate,
            };

            var answersList = new List<Answer>(); // Cast to List<Answer> for Add()

            for (var i = 0; i < form.Answers.Count; i++)
            {
                var value = form.Answers[i];
                if (string.IsNullOrWhiteSpace(value)) continue;

                answersList.Add(new Answer
                {
                    Id = form.AnswersId[i],
                    Index = form.AnswersSort[i],
                    Value = value.Trim(),
                    QuestionId = poll.Id
                });
            }
            poll.Answers = answersList;
            return _questions.Save(poll);
        }
        [HttpPost]
        [Route("post-question-old")]
        public async Task<Question?> PostAsync()
        {
            JsonSerializerOptions options = new JsonSerializerOptions();
            options.Converters.Add(new DateTimeConverterUsingDateTimeParse());

            string requestBody = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            //need to make the Id an int by removing the surrounding "
            var parsedstring = Regex.Replace(requestBody,"(?:\"Id\":\")(\\d)\"","\"Id\":$1");
            //change any undefined properties as null
            parsedstring = Regex.Replace(parsedstring,"\"undefined\"",DateTime.MinValue.ToString());

            var question = JsonSerializer.Deserialize<Question>(parsedstring,options);

            return _questions.Save(question);
        }

        [HttpDelete]
        [Route("delete-question/{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                if (_questions.Delete(id))
                {
                    var response = new
                    {
                        Status = "Success",
                        Message = "Data retrieved successfully",
                        Timestamp = DateTime.UtcNow
                    };
                    return Ok(true);
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e,"Unable to delete question");
            }

            return NotFound(new
            {
                Status = "Error",
                Message = $"Item with ID {id} was not found.",
                Timestamp = DateTime.UtcNow
            });
        }
        [HttpDelete]
        [Route("delete-responses/{id}")]
        public IActionResult DeleteResponse(int id)
        {
            try
            {
                if (_questions.DeleteResponses(id))
                {
                    var response = new
                    {
                        Status = "Success",
                        Message = "Responses delete successfully",
                        Timestamp = DateTime.UtcNow
                    };
                    return Ok(true);
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Unable to delete responses");
            }

            return NotFound(new
            {
                Status = "Error",
                Message = $"Item with ID {id} was not found.",
                Timestamp = DateTime.UtcNow
            });
        }
        [HttpGet]
        [Route("get-answers/{id}")]
        public IEnumerable<Answer> GetAnswers(int id)
        {
            return _questions.GetAnswers(id);
        }

        [HttpPost]
        [Route("post-question-answer")]
        public Answer PostAnswer(int id, Answer answer)
        {
            try
            {
                var result = _questions.PostAnswer(id, answer);

                if (result != null)
                {
                    return result;
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e,"Unable to add answer to question");
                throw;
            }

            return null; 
        }

        [HttpGet]
        [Route("get-response/{id}")]
        public IEnumerable<Response> GetResponses(int id)
        {
            return _questions.GetResponses(id);
        }
    }
}
