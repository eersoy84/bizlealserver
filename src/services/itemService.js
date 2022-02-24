const httpStatus = require('http-status');
const logger = require('../config/logger')
const dbModels = require('../config/dbmodels')
const { product_questions: ProductQuestion, User, product_reviews: ProductReviews } = dbModels;
const ApiError = require('../utils/ApiError');


const askQuestion = async (reqBody, userId) => {
  const { adId, question } = reqBody;
  let result = await ProductQuestion.create({
    user_id: userId,
    product_id: adId,
    user_question: question,
    user_question_date: Date.now(),
    seller_answer: null,
    seller_answer_date: null,
    question_approved: 0,
    answer_approved: 0
  })
  if (!result) throw new ApiError(httpStatus.BAD_REQUEST, "Sorular getirilirken hata oluştu!")
  return result
}

const getQuestions = async (adId) => {
  let questions = await ProductQuestion.findAll({
    where: {
      product_id: adId
    },
    include: [{
      association: 'user'
    }]
  })
  if (!questions) throw new ApiError(httpStatus.BAD_REQUEST, "Sorular getirilirken hata oluştu!")
  return getFormattedQuestions(questions)
}

const getFormattedQuestions = (questions) => {
  return questions.map(question => {
    return {
      id: question.id,
      userName: mask(question.user),
      question: question.user_question,
      questionDate: question.user_question_date,
      answer: question.seller_answer,
      answerDate: question.seller_answer_date
    }
  })
}

const getReviews = async (adId) => {
  let reviews = await ProductReviews.findAll({
    where: {
      product_id: adId,
      review_approved: 1
    },
    include: [{
      association: 'user'
    }]
  })
  if (!reviews) throw new ApiError(httpStatus.BAD_REQUEST, "Sorular getirilirken hata oluştu!")
  return getFormattedReviews(reviews)
}

const getFormattedReviews = (reviews) => {
  return reviews.map(review => {
    return {
      id: review.id,
      userName: mask(review.user),
      content: review.review_content,
      star: review.review_stars,
      date: review.review_date,
    }
  })
}

const mask = (user) => {
  let firstName = user.firstName
  let lastName = user.lastName
  firstName = firstName.replace(firstName.slice(1, - 1), "***")
  lastName = lastName.replace(lastName.slice(1, - 1), "***")
  return `${firstName} ${lastName}`
}



module.exports = {
  askQuestion,
  getQuestions,
  getReviews
};
