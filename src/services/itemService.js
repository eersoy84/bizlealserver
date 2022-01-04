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

const getQuestions = async (reqBody) => {
  const { adId } = reqBody;
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
      userName: formatUserName(question.user),
      question: question.user_question,
      questionDate: question.user_question_date,
      answer: question.seller_answer,
      answerDate: question.seller_answer_date
    }
  })
}

const formatUserName = (user) => {
  let name = `${user.firstName} ${user.lastName}`
  let maskedName = name.replace(name.substring(1, name.length - 1), "****")
  return maskedName
}

const getReviews = async (reqBody) => {
  const { adId } = reqBody;
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
      userName: formatUserName(review.user),
      content: review.review_content,
      star: review.review_stars,
      date: review.review_date,
    }
  })
}

module.exports = {
  askQuestion,
  getQuestions,
  getReviews
};
