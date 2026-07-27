---
name: kronos-candlestick-forecasting
description: Use when forecasting future OHLCV candlestick data with the Kronos foundation model — probabilistic price/volume prediction from historical candles, finetuning Kronos on custom Qlib data, or running the Kronos web UI to visualize forecasts vs ground truth.
---

# Kronos Candlestick Forecasting

Kronos is a pretrained decoder-only Transformer foundation model (tokenizer + autoregressive predictor) for financial candlestick (OHLCV) time-series forecasting, pulled from Hugging Face Hub.

## When to use / when NOT to use

Use when you need a probabilistic multi-step forecast of open/high/low/close/volume from a historical OHLCV series (single or batch), or need to finetune/evaluate Kronos on your own instrument data via Qlib.

Do NOT use as a standalone trading signal or production strategy — the forecast is a raw signal, not alpha. Do NOT use for non-candlestick time series (it's purpose-built for OHLCV).

## Setup

Python 3.10+ required.

```shell
pip install -r requirements.txt
```

Core deps: numpy, pandas, torch>=2.0.0, einops==0.8.1, huggingface_hub==0.33.1, matplotlib==3.9.3, tqdm==4.67.1, safetensors==0.6.2.

No API keys needed — models auto-pull from Hugging Face Hub (`NeoQuasar` org) on first use.

Optional (finetuning): `pip install pyqlib` plus a locally prepared Qlib data directory.

Optional (web UI): `pip install -r webui/requirements.txt` (Flask + Plotly.js).

## Core usage

1. Load matching model + tokenizer pair from Hugging Face Hub:
```python
from model import Kronos, KronosTokenizer, KronosPredictor

tokenizer = KronosTokenizer.from_pretrained("NeoQuasar/Kronos-Tokenizer-base")
model = Kronos.from_pretrained("NeoQuasar/Kronos-small")
```

2. Instantiate the predictor (`max_context` caps usable lookback — see Rules):
```python
predictor = KronosPredictor(model, tokenizer, max_context=512)
```

3. Prepare input — DataFrame must contain `['open','high','low','close']` (`volume`/`amount` optional, zero-filled if missing; `amount` is display-only):
```python
import pandas as pd

df = pd.read_csv("./data/XSHG_5min_600977.csv")
df['timestamps'] = pd.to_datetime(df['timestamps'])

lookback = 400
pred_len = 120

x_df = df.loc[:lookback-1, ['open', 'high', 'low', 'close', 'volume', 'amount']]
x_timestamp = df.loc[:lookback-1, 'timestamps']
y_timestamp = df.loc[lookback:lookback+pred_len-1, 'timestamps']
```

4. Generate a forecast — returns a DataFrame of forecasted OHLCV indexed by `y_timestamp`:
```python
pred_df = predictor.predict(
    df=x_df,
    x_timestamp=x_timestamp,
    y_timestamp=y_timestamp,
    pred_len=pred_len,
    T=1.0,          # Temperature for sampling
    top_p=0.9,      # Nucleus sampling probability
    sample_count=1  # Number of forecast paths to generate and average
)
```

5. Batch prediction across multiple series (all must share the same lookback and pred_len):
```python
df_list = [df1, df2, df3]
x_timestamp_list = [x_ts1, x_ts2, x_ts3]
y_timestamp_list = [y_ts1, y_ts2, y_ts3]

pred_df_list = predictor.predict_batch(
    df_list=df_list,
    x_timestamp_list=x_timestamp_list,
    y_timestamp_list=y_timestamp_list,
    pred_len=pred_len,
    T=1.0,
    top_p=0.9,
    sample_count=1,
    verbose=True
)
```

6. Finetuning pipeline (4 steps — adapt Kronos to custom instrument data via Qlib):
```shell
python finetune/qlib_data_preprocess.py                                       # build train/val/test pkl
torchrun --standalone --nproc_per_node=NUM_GPUS finetune/train_tokenizer.py   # train tokenizer
torchrun --standalone --nproc_per_node=NUM_GPUS finetune/train_predictor.py   # train predictor
python finetune/qlib_test.py --device cuda:0                                  # backtest + report
```
Configure via `finetune/config.py`: `qlib_data_path`, `dataset_path`, `save_path`, `backtest_result_path`, `pretrained_tokenizer_path`, `pretrained_predictor_path`, `instrument`, `train_time_range`, `epochs`, `batch_size`, `use_comet`.

7. Web UI (visualize forecast vs ground truth):
```bash
cd webui
python run.py          # or ./start.sh, or `python app.py`
# visit http://localhost:7070
```
Flow: load data file -> select model + device (CPU/CUDA/MPS) -> set T/top_p/sample_count -> pick a fixed 400+120 time window via slider -> predict -> compare vs ground truth.

## Rules / gotchas

Model/tokenizer pairing — always match these (mismatched pairs will not work correctly):

| Model | Tokenizer | Context length | Params | Open-source |
|---|---|---|---|---|
| Kronos-mini | Kronos-Tokenizer-2k | 2048 | 4.1M | yes |
| Kronos-small | Kronos-Tokenizer-base | 512 | 24.7M | yes |
| Kronos-base | Kronos-Tokenizer-base | 512 | 102.3M | yes |
| Kronos-large | Kronos-Tokenizer-base | 512 | 499.2M | no (not released) |

- `max_context` for Kronos-small/base is 512 — keep `lookback` at or under this; longer input is auto-truncated. Kronos-mini supports up to 2048.
- Sampling params (from webui/README): `T` (temperature) range 0.1–2.0, recommend 1.2–1.5 for quality; `top_p` range 0.1–1.0, recommend 0.95–1.0; `sample_count` range 1–5, recommend 2–3 (more paths = more stable average, more compute).
- torch>=2.0.0 and Python 3.10+ required.
- Batch prediction requires uniform lookback and pred_len across every series in the batch.
- Finetuning demo is explicitly NOT production-ready per repo README: "not a production-ready quantitative trading system. A robust quantitative strategy requires more sophisticated techniques, such as portfolio optimization and risk factor neutralization."
- Treat raw Kronos output as a signal, not alpha — feed it through portfolio optimization/risk neutralization before real use. The repo's example top-K backtest omits transaction costs, slippage, market impact, dynamic sizing, and stop-loss/take-profit — treat any backtest numbers there as illustrative only.
- Comments inside `finetune/` were AI-generated (Gemini 2.5 Pro) and may be inaccurate — trust the code, not the comments.
- Finetuning requires `pyqlib` plus a manually-prepared local Qlib data directory (example scripts assume daily frequency).
- Web UI troubleshooting: port conflict → change port in `app.py`; missing deps → `pip install -r requirements.txt`; model load failure → check network/model ID; data errors → verify column names/format.

---
Source: github.com/shiyu-coder/Kronos @ 67b630e67f6a18c9e9be918d9b4337c960db1e9a
