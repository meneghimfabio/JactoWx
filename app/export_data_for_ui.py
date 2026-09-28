import json
import subprocess
import os

os.makedirs("/Users/meneghimfabio/jetski/JactoWx/app/src/data", exist_ok=True)

def bq_query(sql):
    cmd = [
        "bq", "--location=US", "query", "--use_legacy_sql=false",
        "--format=prettyjson", "--max_rows=100000",
        "--label", "datacloud:jetski", sql
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        raise RuntimeError(f"BQ Query failed:\n{res.stderr}")
    return json.loads(res.stdout)

def to_float(val):
    if val is None or val == "" or val == "null":
        return 0.0
    try:
        return float(val)
    except (ValueError, TypeError):
        return 0.0

def to_int(val):
    if val is None or val == "" or val == "null":
        return 0
    try:
        return int(float(val))
    except (ValueError, TypeError):
        return 0

print("Exporting talhoes GeoJSON...")
talhoes = bq_query("""
SELECT
  talhao,
  id_field,
  fazenda,
  valido_de,
  valido_ate,
  area_ha,
  area_geodesica_ha,
  centroide_lat,
  centroide_lon,
  ST_AsGeoJSON(geometria_talhao) AS geojson_str
FROM `demonstracoes-fabio.JactoWX.talhoes`
ORDER BY talhao
""")

for t in talhoes:
    t["geojson"] = json.loads(t.pop("geojson_str"))
    t["area_ha"] = to_float(t.get("area_ha"))
    t["area_geodesica_ha"] = to_float(t.get("area_geodesica_ha"))
    t["centroide_lat"] = to_float(t.get("centroide_lat"))
    t["centroide_lon"] = to_float(t.get("centroide_lon"))

print(f"Loaded {len(talhoes)} talhoes.")

print("Exporting pulverizacoes GeoJSON...")
pulverizacoes = bq_query("""
SELECT
  talhao,
  id_field,
  data_operacao,
  operacao,
  faixas,
  dose_l_ha,
  volume_l,
  pressao_psi,
  area_aplicada_ha,
  area_no_talhao_ha,
  area_bordadura_excedente_ha,
  pct_cobertura_talhao_dia,
  ST_AsGeoJSON(geometria_pulverizacao) AS geojson_str
FROM `demonstracoes-fabio.JactoWX.pulverizacao_talhao_dia`
ORDER BY data_operacao, talhao
""")

for p in pulverizacoes:
    p["geojson"] = json.loads(p.pop("geojson_str"))
    p["faixas"] = to_int(p.get("faixas"))
    p["dose_l_ha"] = to_float(p.get("dose_l_ha"))
    p["volume_l"] = to_int(p.get("volume_l"))
    p["pressao_psi"] = to_float(p.get("pressao_psi"))
    p["area_aplicada_ha"] = to_float(p.get("area_aplicada_ha"))
    p["area_no_talhao_ha"] = to_float(p.get("area_no_talhao_ha"))
    p["area_bordadura_excedente_ha"] = to_float(p.get("area_bordadura_excedente_ha"))
    p["pct_cobertura_talhao_dia"] = to_float(p.get("pct_cobertura_talhao_dia"))

print(f"Loaded {len(pulverizacoes)} pulverizacoes.")

print("Exporting analise_pulverizacao_clima...")
analise = bq_query("""
SELECT
  data_calendario,
  tipo_horizonte,
  talhao,
  id_field,
  area_talhao_ha,
  id_celula_grade,
  houve_pulverizacao,
  faixas,
  dose_l_ha,
  volume_l,
  pressao_psi,
  area_aplicada_ha,
  area_no_talhao_ha,
  pct_cobertura_talhao_dia,
  temp_media_dia_c,
  temp_min_dia_c,
  temp_max_dia_c,
  temp_diurna_media_c,
  vento_10m_medio_dia_kmh,
  vento_10m_min_dia_kmh,
  vento_10m_max_dia_kmh,
  vento_10m_diurno_medio_kmh,
  vento_10m_p90_dia_kmh,
  chuva_acumulada_dia_mm,
  chuva_p90_dia_mm,
  pressao_media_dia_hpa,
  prob_max_chuva_dia_pct,
  prob_max_vento_deriva_pct,
  prob_max_vento_calmo_inversao_pct,
  prob_max_calor_evaporacao_pct,
  turnos_janela_ideal_dia,
  horas_estimadas_janela_ideal_dia,
  status_janela_pulverizacao_dia,
  motivo_condicao_climatica,
  conformidade_operacao_clima
FROM `demonstracoes-fabio.JactoWX.analise_pulverizacao_clima`
ORDER BY data_calendario, talhao
""")

for a in analise:
    a["houve_pulverizacao"] = (a.get("houve_pulverizacao") is True or a.get("houve_pulverizacao") == "true")
    a["area_talhao_ha"] = to_float(a.get("area_talhao_ha"))
    a["faixas"] = to_int(a.get("faixas"))
    a["dose_l_ha"] = to_float(a.get("dose_l_ha"))
    a["volume_l"] = to_int(a.get("volume_l"))
    a["pressao_psi"] = to_float(a.get("pressao_psi"))
    a["area_aplicada_ha"] = to_float(a.get("area_aplicada_ha"))
    a["area_no_talhao_ha"] = to_float(a.get("area_no_talhao_ha"))
    a["pct_cobertura_talhao_dia"] = to_float(a.get("pct_cobertura_talhao_dia"))
    a["temp_media_dia_c"] = to_float(a.get("temp_media_dia_c"))
    a["temp_min_dia_c"] = to_float(a.get("temp_min_dia_c"))
    a["temp_max_dia_c"] = to_float(a.get("temp_max_dia_c"))
    a["temp_diurna_media_c"] = to_float(a.get("temp_diurna_media_c"))
    a["vento_10m_medio_dia_kmh"] = to_float(a.get("vento_10m_medio_dia_kmh"))
    a["vento_10m_min_dia_kmh"] = to_float(a.get("vento_10m_min_dia_kmh"))
    a["vento_10m_max_dia_kmh"] = to_float(a.get("vento_10m_max_dia_kmh"))
    a["vento_10m_diurno_medio_kmh"] = to_float(a.get("vento_10m_diurno_medio_kmh"))
    a["vento_10m_p90_dia_kmh"] = to_float(a.get("vento_10m_p90_dia_kmh"))
    a["chuva_acumulada_dia_mm"] = to_float(a.get("chuva_acumulada_dia_mm"))
    a["chuva_p90_dia_mm"] = to_float(a.get("chuva_p90_dia_mm"))
    a["pressao_media_dia_hpa"] = to_float(a.get("pressao_media_dia_hpa"))
    a["prob_max_chuva_dia_pct"] = to_float(a.get("prob_max_chuva_dia_pct"))
    a["prob_max_vento_deriva_pct"] = to_float(a.get("prob_max_vento_deriva_pct"))
    a["prob_max_vento_calmo_inversao_pct"] = to_float(a.get("prob_max_vento_calmo_inversao_pct"))
    a["prob_max_calor_evaporacao_pct"] = to_float(a.get("prob_max_calor_evaporacao_pct"))
    a["turnos_janela_ideal_dia"] = to_int(a.get("turnos_janela_ideal_dia"))
    a["horas_estimadas_janela_ideal_dia"] = to_int(a.get("horas_estimadas_janela_ideal_dia"))

print(f"Loaded {len(analise)} analise records.")

print("Exporting clima 6h recent and forecast...")
clima_6h = bq_query("""
SELECT
  id_celula_grade,
  data_local_mt,
  hora_local_mt,
  periodo_dia,
  lead_time_horas,
  tipo_horizonte,
  temp_media_c,
  temp_min_ensemble_c,
  temp_max_ensemble_c,
  temp_p10_c,
  temp_p90_c,
  vento_10m_medio_kmh,
  vento_10m_min_ensemble_kmh,
  vento_10m_max_ensemble_kmh,
  vento_10m_p10_kmh,
  vento_10m_p90_kmh,
  chuva_6h_media_mm,
  chuva_6h_max_ensemble_mm,
  chuva_6h_p90_mm,
  pressao_media_hpa,
  prob_chuva_6h_pct,
  prob_vento_deriva_pct,
  prob_vento_calmo_inversao_pct,
  prob_calor_evaporacao_pct,
  status_janela_6h
FROM `demonstracoes-fabio.JactoWX.clima_weathernext_girassol`
WHERE data_local_mt >= DATE '2026-09-01'
ORDER BY data_local_mt, hora_local_mt, id_celula_grade
""")

for c in clima_6h:
    c["hora_local_mt"] = to_int(c.get("hora_local_mt"))
    c["lead_time_horas"] = to_int(c.get("lead_time_horas"))
    c["temp_media_c"] = to_float(c.get("temp_media_c"))
    c["temp_min_ensemble_c"] = to_float(c.get("temp_min_ensemble_c"))
    c["temp_max_ensemble_c"] = to_float(c.get("temp_max_ensemble_c"))
    c["temp_p10_c"] = to_float(c.get("temp_p10_c"))
    c["temp_p90_c"] = to_float(c.get("temp_p90_c"))
    c["vento_10m_medio_kmh"] = to_float(c.get("vento_10m_medio_kmh"))
    c["vento_10m_min_ensemble_kmh"] = to_float(c.get("vento_10m_min_ensemble_kmh"))
    c["vento_10m_max_ensemble_kmh"] = to_float(c.get("vento_10m_max_ensemble_kmh"))
    c["vento_10m_p10_kmh"] = to_float(c.get("vento_10m_p10_kmh"))
    c["vento_10m_p90_kmh"] = to_float(c.get("vento_10m_p90_kmh"))
    c["chuva_6h_media_mm"] = to_float(c.get("chuva_6h_media_mm"))
    c["chuva_6h_max_ensemble_mm"] = to_float(c.get("chuva_6h_max_ensemble_mm"))
    c["chuva_6h_p90_mm"] = to_float(c.get("chuva_6h_p90_mm"))
    c["pressao_media_hpa"] = to_float(c.get("pressao_media_hpa"))
    c["prob_chuva_6h_pct"] = to_float(c.get("prob_chuva_6h_pct"))
    c["prob_vento_deriva_pct"] = to_float(c.get("prob_vento_deriva_pct"))
    c["prob_vento_calmo_inversao_pct"] = to_float(c.get("prob_vento_calmo_inversao_pct"))
    c["prob_calor_evaporacao_pct"] = to_float(c.get("prob_calor_evaporacao_pct"))

print(f"Loaded {len(clima_6h)} clima 6h records.")

payload = {
    "metadata": {
        "fazenda": "Fazenda Girassol",
        "municipio": "Itiquira / Rondonópolis - MT",
        "area_total_ha": 828.84,
        "talhoes_count": 6,
        "operacoes_count": 110,
        "periodo_historico": "17/09/2025 a 30/07/2026",
        "previsao_futura": "29/09/2026 a 12/10/2026"
    },
    "talhoes": talhoes,
    "pulverizacoes": pulverizacoes,
    "analise": analise,
    "clima_6h": clima_6h
}

out_path = "/Users/meneghimfabio/jetski/JactoWx/app/src/data/jacto_data.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(payload, f, ensure_ascii=False)

sz_mb = os.path.getsize(out_path) / (1024 * 1024)
print(f"Successfully generated {out_path} ({sz_mb:.2f} MB)")
