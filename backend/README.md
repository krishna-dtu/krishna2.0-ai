Run the backend (development):

Windows:

```
backend\run_backend.bat
```

Unix/macOS:

```
./backend/run_backend.sh
```

Or use the module directly:

```
python -m backend.run_server
```

Notes:
- `ENV` defaults to `production`; set `ENV=development` to enable `DEBUG`/reload behavior.
- Do not enable `DEBUG` or auto-reload in production.
