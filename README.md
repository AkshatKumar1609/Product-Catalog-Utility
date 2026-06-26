# 🛒 Product Classifier

> **A multi-modal deep learning system that classifies e-commerce products into categories by jointly analyzing product images and textual metadata (title + description).**

Instead of relying on a single data source, this project fuses two separate neural network branches — a **CNN image encoder** and a **Bidirectional LSTM text encoder** — into one unified model, mirroring how a human naturally reads both the product photo and its description before deciding what category it belongs to.

---

## ✨ Key Features

- **Multi-modal Fusion** — Simultaneously processes product **images** (100×100 RGB) and **text** (title + description) through independent neural branches, then concatenates them for a combined prediction.
- **21-Class Classification** — Predicts one of 21 product categories (Electronics, Clothing, Books, Home & Kitchen, Sports, Toys, Beauty, Automotive, Food, Health, and more).
- **Confidence Score** — Every prediction includes a confidence percentage with a color-coded indicator (🟢 High / 🟡 Moderate / 🔴 Low).
- **REST API** — FastAPI backend with `/predict` (multipart form) and `/health` endpoints; CORS-enabled for seamless frontend integration.
- **Live API Health Indicator** — The frontend polls the backend every 15 seconds and displays real-time connection status.
- **Drag & Drop Image Upload** — Smooth drag-and-drop image dropzone with live preview.
- **Single-Binary Deployment** — The FastAPI server also serves the compiled React frontend as static files, so only one process is needed in production.

---

## 🧰 Tech Stack

### Backend (Core Focus)

| Layer | Technology |
|---|---|
| **Language** | Python 3.x |
| **API Framework** | [FastAPI](https://fastapi.tiangolo.com/) |
| **Deep Learning** | [TensorFlow / Keras](https://www.tensorflow.org/) |
| **Image Processing** | [OpenCV (cv2)](https://opencv.org/) |
| **NLP Preprocessing** | `tensorflow.keras.preprocessing.text.Tokenizer`, `pad_sequences` |
| **Serialisation** | `pickle` (tokenizer & label encoder) |
| **Model Format** | Keras native (`.keras`) |
| **CORS** | `fastapi.middleware.cors.CORSMiddleware` |
| **Static Hosting** | `fastapi.staticfiles.StaticFiles` |

### Frontend

| Layer | Technology |
|---|---|
| **Framework** | [React 19](https://react.dev/) + [Vite 8](https://vite.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Linting** | [OxLint](https://oxc.rs/) |

### Training & Data

| Tool | Purpose |
|---|---|
| **Pandas / NumPy** | Data loading & manipulation |
| **Scikit-learn** | `LabelEncoder` for category encoding |
| **Matplotlib** | Training curve visualisation |
| **Jupyter Notebook** | Model development & experimentation |

---

## 🧠 Model Architecture

The model is a **dual-input, late-fusion neural network** trained end-to-end.

```
                 ┌─────────────────────────────┐
                 │       IMAGE BRANCH (CNN)     │
   [100×100×3]   │                             │
   ─────────────►│  Conv2D(32) + BN + Pool     │
                 │  Conv2D(64) + BN + Pool     │
                 │  Conv2D(128) + BN + Pool    │
                 │  GlobalAveragePooling2D     │
                 │  Dense(128, L2) + Dropout   │──────┐
                 └─────────────────────────────┘      │
                                                      ▼
                                               Concatenate
                 ┌─────────────────────────────┐      │
                 │       TEXT BRANCH (LSTM)     │      │
   [seq_len=100] │                             │      │
   ─────────────►│  Embedding(30000, 128)      │      │
                 │  Bidirectional LSTM(128)    │      │
                 │  Dense(128, ReLU)           │──────┘
                 └─────────────────────────────┘
                                                       │
                                                       ▼
                                          Dense(128, ReLU, L2)
                                                  Dropout(0.5)
                                                       │
                                                       ▼
                                           Dense(21, Softmax)
                                         [21 product categories]
```

**Key architectural decisions:**

- **BatchNormalization** after every convolutional block for training stability and regularisation.
- **L2 regularisation** (`1e-4` on image branch, `1e-3` on fusion layer) to prevent overfitting on the moderately sized dataset.
- **Bidirectional LSTM** in the text branch captures context from both directions of the token sequence.
- **GlobalAveragePooling2D** instead of `Flatten` — reduces parameters and acts as a spatial regulariser.
- **EarlyStopping** (`patience=4`, monitoring `val_loss`, `restore_best_weights=True`) — training stopped at epoch 7 with a best validation accuracy of **~76.5%**.

---

## 📁 Project Structure

```
Product Classifier/
│
├── backend/
│   ├── main.py                  # FastAPI app: /predict, /health, static hosting
│   ├── train.csv                # Training dataset (product records)
│   ├── model/
│   │   ├── model.keras          # Trained dual-input Keras model (~49 MB)
│   │   ├── tokenizer.pkl        # Fitted Keras Tokenizer (vocab: 30,000 tokens)
│   │   └── label_encoder.pkl    # Scikit-learn LabelEncoder (21 categories)
│   ├── train/
│   │   └── *.jpg                # Product images (referenced by ImgId in CSV)
│   └── Training Files/
│       ├── main.ipynb           # Custom CNN + BiLSTM training notebook
│       └── pretrained_model.ipynb  # Alternative pretrained model experiment
│
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js           # Dev proxy → FastAPI; Tailwind CSS plugin
    └── src/
        ├── App.jsx
        ├── index.css
        └── components/
            ├── Header.jsx       # Brand header + live API health indicator
            ├── ClassifierForm.jsx  # Multi-field form, form state & API call
            ├── ImageDropzone.jsx   # Drag-and-drop image uploader w/ preview
            └── ResultCard.jsx   # Prediction badge, confidence bar, metadata
```

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.9+**
- **Node.js 18+** and **npm**
- **Git**

---

### 1. Clone the repository

```bash
git clone https://github.com/AkshatKumar1609/Product-Classifier.git
cd "Product Classifier"
```

---

### 2. Backend Setup

```bash
cd backend

# (Recommended) Create a virtual environment
python -m venv venv
source venv/bin/activate        # Linux / macOS
# venv\Scripts\activate         # Windows

# Install dependencies
pip install fastapi uvicorn tensorflow opencv-python scikit-learn
```

> **Note:** The pre-trained model files (`model.keras`, `tokenizer.pkl`, `label_encoder.pkl`) must be present in `backend/model/`. These are committed to the repository.

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

---

### 4. Run in Development Mode

**Terminal 1 — Start the FastAPI backend** (from the project root):

```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 — Start the React dev server** (from `/frontend`):

```bash
npm run dev
```

The Vite dev server proxies `/predict` and `/health` requests to `localhost:8000`, so no CORS issues occur during development.

Open **http://localhost:5173** in your browser.

---

### 5. Production Build (optional)

Build the frontend bundle and let FastAPI serve everything from a single port:

```bash
# Inside /frontend
npm run build
```

FastAPI will automatically detect and serve the `frontend/dist` directory at `/`:

```bash
# From the project root
uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

Open **http://localhost:8000**.

---

## 💡 Usage

### Via the Web UI

1. Enter a **Product Title** (required).
2. Optionally add a **Description** for improved accuracy.
3. **Upload** or **drag & drop** a product image (JPG / PNG / WEBP).
4. Click **"Classify Product"** and wait for the prediction.
5. The **Result Card** displays the predicted category badge and a colour-coded confidence bar.

### Via the REST API directly

```bash
curl -X POST http://localhost:8000/predict \
  -F "title=Sony WH-1000XM5 Wireless Headphones" \
  -F "description=Industry-leading noise canceling with 30-hour battery life" \
  -F "image=@/path/to/headphones.jpg"
```

**Response:**

```json
{
  "prediction": "Electronics",
  "confidence": 0.9412
}
```

### Health Check

```bash
curl http://localhost:8000/health
# {"status": "ok"}
```

---

## 🔬 Technical Highlights

| Aspect | Detail |
|---|---|
| **Input preprocessing (image)** | BGR → RGB conversion via OpenCV, resize to 100×100, normalize to `[0, 1]` float32 |
| **Input preprocessing (text)** | Title + description concatenated, tokenized with `Tokenizer(num_words=30000, oov_token="<UNK>")`, padded/truncated to length 100 |
| **Training split** | Last 10% of shuffled dataset used as validation |
| **Optimiser** | Adam |
| **Loss** | `sparse_categorical_crossentropy` |
| **Best val accuracy** | ~76.5% (epoch 5) |
| **Inference** | Model takes a named-input dict `{"img": ..., "text": ...}` — both branches run in parallel; prediction = `argmax(softmax output)` |
| **Serialisation** | Tokenizer and LabelEncoder serialised with `pickle`; model saved in Keras native format |
