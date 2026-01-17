using Our.Community.Polls.Models;
using Our.Community.Polls.PollConstants;
using Our.Community.Polls.Repositories;
using System;
using System.Text.Json;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.PublishedCache;

namespace Our.Community.Polls.Converters
{

    public class PollsValueConverter : IPropertyValueConverter
    {
        private readonly IQuestions _questions;
        public PollsValueConverter(IQuestions questions)
        {
            _questions = questions;
        }
        public bool IsConverter(IPublishedPropertyType propertyType)
        {
            return //false;
            ApplicationConstants.PropertyEditorAlias.Equals("Umbraco.Community.Polls")
            && propertyType.EditorAlias.Equals("Umbraco.Plain.Json");
        }

        public bool? IsValue(object value, PropertyValueLevel level)
        {
            var test = value;
            return true;
        }

        public Type GetPropertyValueType(IPublishedPropertyType propertyType)
        {
            return typeof(Question);
        }

        public PropertyCacheLevel GetPropertyCacheLevel(IPublishedPropertyType propertyType)
        {
            return PropertyCacheLevel.Element;
        }

        public object ConvertSourceToIntermediate(IPublishedElement owner, IPublishedPropertyType propertyType, object source,
            bool preview)
        {
             if (!string.IsNullOrWhiteSpace(source?.ToString()))
             {
                if (int.TryParse(source.ToString(), out var id))
                {
                    return _questions.GetById(id);
                }
                else
                {
                    try
                    {
                        // Options approach (camelCase + case-insensitive)
                        var options = new JsonSerializerOptions
                        {
                            PropertyNameCaseInsensitive = true,
                            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                        };
                        List<Question> polls = JsonSerializer.Deserialize<List<Question>>(source?.ToString(), options);
                        if (polls != null && polls.Count > 0)
                        {
                            return _questions.GetById(polls[0].Id);
                        }
                    }
                    catch (Exception)
                    {

                    }

                }

             }
             return source?.ToString();

        }

        public object ConvertIntermediateToObject(IPublishedElement owner, IPublishedPropertyType propertyType,
            PropertyCacheLevel referenceCacheLevel, object inter, bool preview)
        {

            return inter;
        }

        public object ConvertIntermediateToXPath(IPublishedElement owner, IPublishedPropertyType propertyType,
            PropertyCacheLevel referenceCacheLevel, object inter, bool preview)
        {
            throw new NotImplementedException();
        }

    }
}
