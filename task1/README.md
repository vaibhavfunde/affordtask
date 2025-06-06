# 📈 Stock Price Aggregation Web Application

A responsive, high-performance React-based frontend for real-time stock market analysis using data from a simulated stock exchange test server.

> ⚠️ This application is built for a controlled evaluation environment. It strictly consumes **authorized internal APIs only** and runs at **http://localhost:3000**.

---

## 🚀 Features

### 📊 Stock Price Chart
- Visualize real-time stock prices over a user-defined time frame (`m` minutes).
- Dynamic, interactive chart with:
  - Tooltips on hover to view price and timestamp.
  - Average price line clearly highlighted.
  - Selectable time intervals for customized insights.

### 🔥 Correlation Heatmap
- Displays pairwise correlation between stock prices over the past `m` minutes.
- Hover over rows/columns to see:
  - Mean price of the stock.
  - Standard deviation of the stock's price in the given interval.
- Gradient color scale from strong negative to strong positive correlation.
- Fully responsive layout for both desktop and mobile.

---

## 🧠 Key Technical Concepts

- **React + Material UI**: Clean, responsive, and accessible UI components.
- **Axios** for API interactions with request optimization to minimize cost.
- **Data Caching & Batching**: Reduces redundant API calls while ensuring up-to-date data.
- **Custom Hooks**: Encapsulate logic like fetching, polling, and transforming data.
- **Chart.js**: Used for rendering line charts and heatmaps with tooltips and interactivity.
- **Pearson Correlation**: Implemented with custom functions using:
  ```text
  Correlation(X, Y) = Cov(X, Y) / (σX * σY)
