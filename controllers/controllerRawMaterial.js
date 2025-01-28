const { RawMaterial } = require("../models");

class ControllerRawMaterial {
  static async cretaeRawMaterial(req, res) {
    try {
      const { name, unit,stock } = req.body;
      const rawMaterial = await RawMaterial.create({
        name,
        unit,
        stock
      });
      res
        .status(201)
        .json({ message: "Recipes created successfully", rawMaterial });
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  }

  static async getRawMaterial(req, res) {
    try {
      const { categoryId, page = 1, size = 10 } = req.query; // Default page 1 dan size 10
      const limit = parseInt(size); // Mengubah size menjadi integer
      const offset = (page - 1) * limit; // Menghitung offset berdasarkan halaman

      const condition = categoryId ? { categoryId } : {}; // Kondisi filter berdasarkan categoryId jika ada

      // Query untuk mengambil produk dengan paginasi dan kategori
      const products = await Product.findAndCountAll({
        where: condition, // Filter berdasarkan categoryId jika ada
        include: {
          model: Category, // Join dengan tabel Category
          as: "category", // Alias yang sesuai dengan yang ada di model
        },
        limit, // Batasan jumlah hasil per halaman
        offset, // Posisi awal hasil pada halaman tertentu
      });

      // Menghitung total halaman berdasarkan jumlah total data dan ukuran per halaman
      const totalPages = Math.ceil(products.count / limit);

      // Mengirimkan hasil dengan informasi paginasi
      res.status(200).json({
        data: products.rows, // Hasil produk
        currentPage: parseInt(page), // Halaman saat ini
        totalPages, // Total halaman
        totalItems: products.count, // Jumlah total produk
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Failed to fetch products", error });
    }
  }
}

module.exports = ControllerRawMaterial;
