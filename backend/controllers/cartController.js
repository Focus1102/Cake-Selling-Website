const asyncHandler = require("express-async-handler");
const Cart = require("../models/cartModel");

exports.getCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  let cart = await Cart.findOne({ userId }).populate("items.productId");
  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }
  res.status(200).json(cart);
});

exports.addToCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { variantId, quantity, productId, name, size, price, image } = req.body;

  if (!productId || !variantId || !name || !price || quantity <= 0) {
    res.status(400);
    throw new Error("Dữ liệu không hợp lệ");
  }

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.variantId === variantId
  );

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items.push({
      variantId,
      productId,
      name,
      size,
      quantity,
      price,
      image,
    });
  }

  cart.updatedAt = Date.now();
  await cart.save();
  res.status(200).json(cart);
});

exports.updateCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { variantId, quantity, productId, name, size, price, image } =
    req.body;

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.variantId === variantId
  );
  if (itemIndex > -1) {
    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].name = name;
      cart.items[itemIndex].size = size;
      cart.items[itemIndex].price = price;
      cart.items[itemIndex].image = image;
    }
  } else if (quantity > 0) {
    cart.items.push({
      variantId,
      productId,
      name,
      size,
      quantity,
      price,
      image,
    });
  }

  cart.updatedAt = Date.now();
  await cart.save();
  res.status(200).json(cart);
});

exports.removeFromCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { variantId } = req.params;

  const cart = await Cart.findOne({ userId });
  if (cart) {
    cart.items = cart.items.filter((item) => item.variantId !== variantId);
    cart.updatedAt = Date.now();
    await cart.save();
  }
  res.status(200).json(cart || { items: [] });
});

exports.clearCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const cart = await Cart.findOne({ userId });
  if (cart) {
    cart.items = [];
    cart.updatedAt = Date.now();
    await cart.save();
  }
  res.status(200).json({ message: "Giỏ hàng đã được xóa", items: [] });
});
