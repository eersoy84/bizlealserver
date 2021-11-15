
var DataTypes = require("sequelize").DataTypes;

var _app_execution = require("./app_execution");
var _app_response = require("./app_response");
var _brand_category = require("./brand_category");
var _brands = require("./brands");
var _categories = require("./categories");
var _cc_bin = require("./cc_bin");
var _email_tokens = require("./email_tokens");
var _featured_product = require("./featured_product");
var _groups = require("./groups");
var _institutions = require("./institutions");
var _model = require("./model");
var _order_items = require("./order_items");
var _order_limits_by_group = require("./order_limits_by_group");
var _payments = require("./payments");
var _phone_tokens = require("./phone_tokens");
var _product_images = require("./product_images");
var _product_questions = require("./product_questions");
var _product_reviews = require("./product_reviews");
var _product_specs = require("./product_specs");
var _product_taxes = require("./product_taxes");
var _products = require("./products");
var _rating_values = require("./rating_values");
var _return_reasons = require("./return_reasons");
var _seller = require("./seller");
var _sendgrid_credentials = require("./sendgrid_credentials");
var _sms_credentials = require("./sms_credentials");
var _taxes = require("./taxes");
var _tokens = require("./tokens");
var _user_address = require("./user_address");
var _user_cart = require("./user_cart");
var _user_cart_item_return_requests = require("./user_cart_item_return_requests");
var _user_cart_items = require("./user_cart_items");
var _user_cart_returns = require("./user_cart_returns");
var _user_cart_taxes = require("./user_cart_taxes");
var _user_chart_seller_ratings = require("./user_chart_seller_ratings");
var _user_favorites = require("./user_favorites");
var _user_groups = require("./user_groups");
var _user_orders = require("./user_orders");
var _user_seller_access = require("./user_seller_access");
var _users = require("./user");

function initModels(sequelize) {
  var app_execution = _app_execution(sequelize, DataTypes);
  var app_response = _app_response(sequelize, DataTypes);
  var brand_category = _brand_category(sequelize, DataTypes);
  var brands = _brands(sequelize, DataTypes);
  var categories = _categories(sequelize, DataTypes);
  var cc_bin = _cc_bin(sequelize, DataTypes);
  var email_tokens = _email_tokens(sequelize, DataTypes);
  var featured_product = _featured_product(sequelize, DataTypes);
  var groups = _groups(sequelize, DataTypes);
  var institutions = _institutions(sequelize, DataTypes);
  var model = _model(sequelize, DataTypes);
  var order_items = _order_items(sequelize, DataTypes);
  var order_limits_by_group = _order_limits_by_group(sequelize, DataTypes);
  var payments = _payments(sequelize, DataTypes);
  var phone_tokens = _phone_tokens(sequelize, DataTypes);
  var product_images = _product_images(sequelize, DataTypes);
  var product_questions = _product_questions(sequelize, DataTypes);
  var product_reviews = _product_reviews(sequelize, DataTypes);
  var product_specs = _product_specs(sequelize, DataTypes);
  var product_taxes = _product_taxes(sequelize, DataTypes);
  var products = _products(sequelize, DataTypes);
  var rating_values = _rating_values(sequelize, DataTypes);
  var return_reasons = _return_reasons(sequelize, DataTypes);
  var seller = _seller(sequelize, DataTypes);
  var sendgrid_credentials = _sendgrid_credentials(sequelize, DataTypes);
  var sms_credentials = _sms_credentials(sequelize, DataTypes);
  var taxes = _taxes(sequelize, DataTypes);
  var tokens = _tokens(sequelize, DataTypes);
  var user_address = _user_address(sequelize, DataTypes);
  var user_cart = _user_cart(sequelize, DataTypes);
  var user_cart_item_return_requests = _user_cart_item_return_requests(sequelize, DataTypes);
  var user_cart_items = _user_cart_items(sequelize, DataTypes);
  var user_cart_returns = _user_cart_returns(sequelize, DataTypes);
  var user_cart_taxes = _user_cart_taxes(sequelize, DataTypes);
  var user_chart_seller_ratings = _user_chart_seller_ratings(sequelize, DataTypes);
  var user_favorites = _user_favorites(sequelize, DataTypes);
  var user_groups = _user_groups(sequelize, DataTypes);
  var user_orders = _user_orders(sequelize, DataTypes);
  var user_seller_access = _user_seller_access(sequelize, DataTypes);
  var User = _users(sequelize, DataTypes);

  // brand_category.belongsTo(brands, { as: "brand", foreignKey: "brand_id"});
  // brand_category.belongsTo(categories, { as: "category", foreignKey: "category_id"});
  // categories.hasMany(brand_category, { as: "brand_category", foreignKey: "category_id"});
  // brands.hasMany(brand_category, { as: "brand_category", foreignKey: "brand_id"});

  // categories.belongsToMany(brands, { through: 'brand_category', foreignKey: 'category_id' });
  // brands.belongsToMany(categories, { through: 'brand_category', foreignKey: 'brand_id' });

  categories.belongsToMany(brands, { through: 'model', foreignKey: 'category_id' });
  brands.belongsToMany(categories, { through: 'model', foreignKey: 'brand_id' });

  
  model.belongsTo(brands, { as: "brand", foreignKey: "brand_id" });
  model.belongsTo(categories, { as: "category", foreignKey: "category_id" });
  // categories.hasMany(model, { as: "models", foreignKey: "category_id" });
  // brands.hasMany(model, { as: "models", foreignKey: "brand_id" });
  
  categories.hasMany(categories, { as: "subCategories", foreignKey: "parentId" });
  order_limits_by_group.belongsTo(groups, { as: "group", foreignKey: "group_id" });
  groups.hasMany(order_limits_by_group, { as: "order_limits_by_groups", foreignKey: "group_id" });
  user_groups.belongsTo(groups, { as: "group", foreignKey: "group_id" });
  groups.hasOne(user_groups, { as: "user_group", foreignKey: "group_id" });
  user_orders.belongsTo(institutions, { as: "institution", foreignKey: "institution_id" });
  institutions.hasMany(user_orders, { as: "user_orders", foreignKey: "institution_id" });
  products.belongsTo(model, { as: "model", foreignKey: "model_id" });
  model.hasMany(products, { as: "products", foreignKey: "model_id" });
  featured_product.belongsTo(products, { as: "product", foreignKey: "product_id" });
  products.hasMany(featured_product, { as: "featured_products", foreignKey: "product_id" });
  order_limits_by_group.belongsTo(products, { as: "product", foreignKey: "product_id" });
  products.hasMany(order_limits_by_group, { as: "order_limits_by_groups", foreignKey: "product_id" });
  product_images.belongsTo(products, { as: "product", foreignKey: "product_id" });
  products.hasMany(product_images, { as: "product_images", foreignKey: "product_id" });
  product_questions.belongsTo(products, { as: "product", foreignKey: "product_id" });
  products.hasMany(product_questions, { as: "product_questions", foreignKey: "product_id" });
  product_reviews.belongsTo(products, { as: "product", foreignKey: "product_id" });
  products.hasMany(product_reviews, { as: "product_reviews", foreignKey: "product_id" });
  product_specs.belongsTo(products, { as: "product", foreignKey: "product_id" });
  products.hasMany(product_specs, { as: "product_specs", foreignKey: "product_id" });
  product_taxes.belongsTo(products, { as: "product", foreignKey: "product_id" });
  products.hasMany(product_taxes, { as: "product_taxes", foreignKey: "product_id" });
  user_cart_items.belongsTo(products, { as: "product", foreignKey: "product_id" });
  products.hasMany(user_cart_items, { as: "user_cart_items", foreignKey: "product_id" });
  user_favorites.belongsTo(products, { as: "product", foreignKey: "product_id" });
  products.hasMany(user_favorites, { as: "user_favorites", foreignKey: "product_id" });
  user_orders.belongsTo(products, { as: "product", foreignKey: "product_id" });
  products.hasMany(user_orders, { as: "user_orders", foreignKey: "product_id" });
  user_chart_seller_ratings.belongsTo(rating_values, { as: "rating_value", foreignKey: "rating_value_id" });
  rating_values.hasMany(user_chart_seller_ratings, { as: "user_chart_seller_ratings", foreignKey: "rating_value_id" });
  user_cart_item_return_requests.belongsTo(return_reasons, { as: "return_reason", foreignKey: "return_reason_id" });
  return_reasons.hasMany(user_cart_item_return_requests, { as: "user_cart_item_return_requests", foreignKey: "return_reason_id" });
  products.belongsTo(seller, { as: "seller_seller", foreignKey: "seller" });
  seller.hasMany(products, { as: "products", foreignKey: "seller" });
  user_chart_seller_ratings.belongsTo(seller, { as: "seller", foreignKey: "seller_id" });
  seller.hasMany(user_chart_seller_ratings, { as: "user_chart_seller_ratings", foreignKey: "seller_id" });
  user_seller_access.belongsTo(seller, { as: "seller", foreignKey: "seller_id" });
  seller.hasMany(user_seller_access, { as: "user_seller_accesses", foreignKey: "seller_id" });
  product_taxes.belongsTo(taxes, { as: "tax", foreignKey: "tax_id" });
  taxes.hasMany(product_taxes, { as: "product_taxes", foreignKey: "tax_id" });
  user_cart_taxes.belongsTo(taxes, { as: "tax", foreignKey: "tax_id" });
  taxes.hasMany(user_cart_taxes, { as: "user_cart_taxes", foreignKey: "tax_id" });
  user_cart.belongsTo(user_address, { as: "invoice", foreignKey: "invoice_id" });
  user_address.hasMany(user_cart, { as: "user_carts", foreignKey: "invoice_id" });
  user_cart.belongsTo(user_address, { as: "address", foreignKey: "address_id" });
  user_address.hasMany(user_cart, { as: "address_user_carts", foreignKey: "address_id" });
  user_cart_items.belongsTo(user_cart, { as: "cart", foreignKey: "cart_id" });
  user_cart.hasMany(user_cart_items, { as: "user_cart_items", foreignKey: "cart_id" });
  user_cart_taxes.belongsTo(user_cart, { as: "cart", foreignKey: "cart_id" });
  user_cart.hasMany(user_cart_taxes, { as: "user_cart_taxes", foreignKey: "cart_id" });
  user_chart_seller_ratings.belongsTo(user_cart, { as: "cart", foreignKey: "cart_id" });
  user_cart.hasMany(user_chart_seller_ratings, { as: "user_chart_seller_ratings", foreignKey: "cart_id" });
  user_cart_item_return_requests.belongsTo(user_cart_items, { as: "user_cart_item", foreignKey: "user_cart_item_id" });
  user_cart_items.hasMany(user_cart_item_return_requests, { as: "user_cart_item_return_requests", foreignKey: "user_cart_item_id" });
  payments.belongsTo(user_orders, { as: "order", foreignKey: "order_id" });
  user_orders.hasMany(payments, { as: "payments", foreignKey: "order_id" });
  email_tokens.belongsTo(User, { as: "user", foreignKey: "user_id" });
  User.hasMany(email_tokens, { as: "email_tokens", foreignKey: "user_id" });
  phone_tokens.belongsTo(User, { as: "user", foreignKey: "user_id" });
  User.hasMany(phone_tokens, { as: "phone_tokens", foreignKey: "user_id" });
  product_questions.belongsTo(User, { as: "user", foreignKey: "user_id" });
  User.hasMany(product_questions, { as: "product_questions", foreignKey: "user_id" });
  product_reviews.belongsTo(User, { as: "user", foreignKey: "user_id" });
  User.hasMany(product_reviews, { as: "product_reviews", foreignKey: "user_id" });
  tokens.belongsTo(User, { as: "user_user", foreignKey: "user" });
  User.hasMany(tokens, { as: "tokens", foreignKey: "user" });
  user_address.belongsTo(User, { as: "user", foreignKey: "user_id" });
  User.hasMany(user_address, { as: "user_addresses", foreignKey: "user_id" });
  user_cart.belongsTo(User, { as: "user", foreignKey: "user_id" });
  User.hasMany(user_cart, { as: "user_carts", foreignKey: "user_id" });
  user_favorites.belongsTo(User, { as: "user", foreignKey: "user_id" });
  User.hasMany(user_favorites, { as: "user_favorites", foreignKey: "user_id" });
  user_groups.belongsTo(User, { as: "user", foreignKey: "user_id" });
  User.hasMany(user_groups, { as: "user_groups", foreignKey: "user_id" });
  user_orders.belongsTo(User, { as: "user", foreignKey: "user_id" });
  User.hasMany(user_orders, { as: "user_orders", foreignKey: "user_id" });
  user_seller_access.belongsTo(User, { as: "user", foreignKey: "user_id" });
  User.hasMany(user_seller_access, { as: "user_seller_accesses", foreignKey: "user_id" });

  return {
    app_execution,
    app_response,
    brand_category,
    brands,
    categories,
    cc_bin,
    email_tokens,
    featured_product,
    groups,
    institutions,
    model,
    order_items,
    order_limits_by_group,
    payments,
    phone_tokens,
    product_images,
    product_questions,
    product_reviews,
    product_specs,
    product_taxes,
    products,
    rating_values,
    return_reasons,
    seller,
    sendgrid_credentials,
    sms_credentials,
    taxes,
    tokens,
    user_address,
    user_cart,
    user_cart_item_return_requests,
    user_cart_items,
    user_cart_returns,
    user_cart_taxes,
    user_chart_seller_ratings,
    user_favorites,
    user_groups,
    user_orders,
    user_seller_access,
    User,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
