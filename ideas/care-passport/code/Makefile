BASE_URL = http://localhost:8000

.PHONY: up down logs restart-api restart-worker test lint smoke journey tunnel

up:
	docker compose up -d --build
	@echo "Waiting for API to be healthy..."
	@for i in $$(seq 1 30); do \
		if curl -sf $(BASE_URL)/health > /dev/null 2>&1; then \
			echo "API is up: $$(curl -s $(BASE_URL)/health)"; \
			break; \
		fi; \
		echo "  attempt $$i/30 — waiting..."; \
		sleep 3; \
	done
	@echo "Resolving cloudflared tunnel URL..."
	@set -a; [ -f .env ] && . ./.env; set +a; \
	TUNNEL=""; \
	if [ -n "$$CLOUDFLARE_TUNNEL_HOSTNAME" ]; then \
		TUNNEL="https://$$CLOUDFLARE_TUNNEL_HOSTNAME"; \
		MODE="named (persistent)"; \
	else \
		MODE="quick (ephemeral)"; \
		for i in $$(seq 1 30); do \
			TUNNEL=$$(docker compose logs cloudflared 2>/dev/null | grep -oE 'https://[a-z0-9-]+\.trycloudflare\.com' | head -1); \
			if [ -n "$$TUNNEL" ]; then break; fi; \
			sleep 1; \
		done; \
	fi; \
	echo ""; \
	printf '\033[1;36m'; \
	echo "================================================================="; \
	echo "  care-passport stack is up"; \
	echo "================================================================="; \
	printf '\033[0m'; \
	echo "  Local API health:    http://localhost:8000/health"; \
	echo "  Temporal UI:         http://localhost:8233"; \
	if [ -n "$$TUNNEL" ]; then \
		echo ""; \
		printf '\033[1;32m'; \
		echo "  Public tunnel:       $$TUNNEL  ($$MODE)"; \
		printf '\033[0m'; \
		echo "  Vapi KB webhook:     $$TUNNEL/vapi/kb?patient_id=anna"; \
		echo "  Vapi end-of-call:    $$TUNNEL/vapi/end-of-call?patient_id=anna"; \
	else \
		echo ""; \
		echo "  (cloudflared tunnel not yet ready — run 'make tunnel' to retry)"; \
	fi; \
	printf '\033[1;36m'; \
	echo "================================================================="; \
	printf '\033[0m'

tunnel:
	@set -a; [ -f .env ] && . ./.env; set +a; \
	if [ -n "$$CLOUDFLARE_TUNNEL_HOSTNAME" ]; then \
		TUNNEL="https://$$CLOUDFLARE_TUNNEL_HOSTNAME"; \
	else \
		TUNNEL=$$(docker compose logs cloudflared 2>/dev/null | grep -oE 'https://[a-z0-9-]+\.trycloudflare\.com' | head -1); \
	fi; \
	if [ -z "$$TUNNEL" ]; then \
		echo "No tunnel URL available. For persistent: set CLOUDFLARE_TUNNEL_HOSTNAME in .env. For quick: check 'docker compose logs cloudflared'."; \
		exit 1; \
	fi; \
	printf '\033[1;32m  Public tunnel:       %s\033[0m\n' "$$TUNNEL"; \
	echo "  Vapi KB webhook:     $$TUNNEL/vapi/kb?patient_id=anna"; \
	echo "  Vapi end-of-call:    $$TUNNEL/vapi/end-of-call?patient_id=anna"

down:
	docker compose down

logs:
	docker compose logs -f

restart-api:
	docker compose up -d --build api

restart-worker:
	docker compose up -d --build worker

test:
	uv run pytest -q

journey:
	uv run pytest -q -m journey tests/journey

lint:
	uv run ruff check src tests

smoke:
	@echo "=== Care Passport Smoke Test ==="
	@echo ""

	@echo "1. Create patient anna"
	@curl -sf -X POST $(BASE_URL)/patients \
	  -H 'Content-Type: application/json' \
	  -d '{"id":"anna","display_name":"Anna Kowalski"}' | python3 -m json.tool
	@echo ""

	@echo "2. GET /patients"
	@curl -sf $(BASE_URL)/patients | python3 -m json.tool
	@echo ""

	@echo "3. POST /vapi/kb"
	@curl -sf -X POST "$(BASE_URL)/vapi/kb?patient_id=anna" \
	  -H 'Content-Type: application/json' \
	  -d '{"message":{"type":"knowledge-base-request","messages":[{"role":"user","content":"What soothes Anna?"}]}}' \
	  | python3 -m json.tool
	@echo ""

	@echo "4. POST /patients/anna/contributions"
	@curl -sf -X POST $(BASE_URL)/patients/anna/contributions \
	  -H 'Content-Type: application/json' \
	  -d '{"text":"Anna was calm after we played Frank Sinatra today.","attribution":{"kind":"staff","name":"Nurse Jo"},"channel":"shift_app"}' \
	  | python3 -m json.tool
	@echo ""

	@echo "5. GET /patients/anna/passport"
	@curl -sf $(BASE_URL)/patients/anna/passport | python3 -m json.tool
	@echo ""

	@echo "6. GET /patients/anna/hot-moments"
	@curl -sf $(BASE_URL)/patients/anna/hot-moments | python3 -m json.tool
	@echo ""

	@echo "7. GET /patients/anna/completeness"
	@curl -sf $(BASE_URL)/patients/anna/completeness | python3 -m json.tool
	@echo ""

	@echo "8. GET /patients/anna/timeline"
	@curl -sf "$(BASE_URL)/patients/anna/timeline?limit=3" | python3 -m json.tool
	@echo ""

	@echo "9. POST /patients/anna/query"
	@curl -sf -X POST $(BASE_URL)/patients/anna/query \
	  -H 'Content-Type: application/json' \
	  -d '{"question":"What calms Anna down?"}' | python3 -m json.tool
	@echo ""

	@echo "=== Smoke test complete ==="
