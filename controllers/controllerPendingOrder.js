const {
  Product,
  PendingOrder,
  PendingOrderItem,
  Recipe,
  sequelize,
} = require("../models");

class ControllerPendingOrder {
  static async cretaePendingOrder(req, res) {
    const transaction = await sequelize.transaction(); // Mulai transaksi
    try {
      const { customerName, products } = req.body;

      // Validasi input
      if (!customerName || !products || products.length === 0) {
        return res
          .status(400)
          .json({ message: "Invalid input: missing customerName or products" });
      }

      // Step 1: Membuat PendingOrder
      const pendingOrder = await PendingOrder.create(
        {
          userId: req.user.id,
          customerName,
        },
        { transaction }
      );

      // Step 2: Membuat PendingOrderItems menggunakan bulkCreate
      const pendingOrderItems = await PendingOrderItem.bulkCreate(
        products.map((product) => ({
          productId: product.productId,
          pendingOrderId: pendingOrder.id,
          quantity: product.quantity,
        })),
        { transaction }
      );

      // Commit transaksi
      await transaction.commit();

      // Menyusun respons dengan data yang relevan
      res.status(201).json({
        message: "Pending order created successfully",
        pendingOrder,
        pendingOrderItems,
      });
    } catch (error) {
      // Rollback transaksi jika ada error
      await transaction.rollback();
      console.log(error);
      res.status(400).json({ message: "Error creating pending order", error });
    }
  }

  static async getOrder(req, res) {
    try {
      const orders = await PendingOrder.findAll({
        include: [
          {
            model: PendingOrderItem,
            as: "item",
            include: [{ model: Product, as: "product" }],
          },
        ],
      });

      // Jika tidak ada pesanan ditemukan
      if (orders.length === 0) {
        return { message: "No orders found" };
      }
      res.status(200).json({
        message: "Orders fetched successfully",
        orders: orders,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Failed to fetch Order", error });
    }
  }

  static async deleteOrder(req, res) {
    const orderId = req.params.id;

    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    try {
      // Cari order berdasarkan ID
      const order = await PendingOrder.findByPk(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Hapus order (items akan otomatis terhapus karena CASCADE)
      await order.destroy();

      return res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Failed to delete order", error: error.message });
    }
  }
}

module.exports = ControllerPendingOrder;
