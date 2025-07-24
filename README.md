# 📊 Excel Analytics Platform

An intuitive web-based Excel analytics platform that allows you to upload `.xlsx` files and perform advanced chart analysis — including **Bar**, **Line**, **Pie**, and **Scatter** charts.

✅ Built-in **drag-and-drop** interface lets you choose fields (X and Y axis) effortlessly from available labels, enabling fast and flexible data exploration.

🔗 **Live URL**: [https://zidioexcel.netlify.app](https://zidioexcel.netlify.app)

---

## 🚀 Features

- 📁 Upload `.xlsx` (Excel) files directly
- 📊 Interactive chart types:
  - Bar Chart
  - Line Chart
  - Pie Chart
  - Scatter Plot
- 🎯 Drag and drop fields to assign X and Y axes
- 🧠 Smart label extraction from uploaded files
- ⚙️ Admin dashboard for managing uploads

---

## 🧪 Try it Out

### 🔐 Admin Credentials

```
Email: admin@gmail.com  
Password: admin
```

> Login as admin to view and manage uploaded datasets.

---

## 🖥️ Tech Stack

- **Frontend**: React.js, Tailwind CSS
- **Charting**: Chart.js (via react-chartjs-2)
- **Excel Parsing**: SheetJS (xlsx)
- **Hosting**: Netlify

---

## 📂 Folder Structure (Client-Side)

```
src/
├── /pagescomponents/ # Reusable UI components
├── pages/            # Page views (Dashboard, Upload, Charts)
├── icons/            # icons
└── App.jsx           # Main application entry
```

---

## 📥 Uploading Excel Files

- Files must be in `.xlsx` format
- First row should contain headers (field labels)
- Ensure numeric fields are used for Y-axis in charts (except pie)

---

## 🧩 Drag & Drop Chart Builder

1. Upload an Excel file
2. Choose a chart type
3. Drag labels from the label pool into the X and Y axis boxes
4. Instantly see the chart rendered with your selected dimensions

---

## 📌 Future Improvements

- Grouped bar charts
- Multiple file uploads
- User accounts and saved dashboards
- Export chart as PNG or PDF

---

## 🤝 Contributing

Pull requests are welcome! If you’d like to suggest a feature or report a bug, please open an issue first.

---

## 📜 License

MIT License

---

## ✨ Developed By

Harsh Hirani , DeepShah  
[Visit Live Project](https://zidioexcel.netlify.app)
