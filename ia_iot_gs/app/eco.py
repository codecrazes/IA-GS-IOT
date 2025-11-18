from .store import IAS

EMISSAO_CO2_G_POR_WH = 0.475  # fator de conversão simples (gCO2 por Wh)

def eco_ranking():
    # ordena por eco_score desc e, em empate, menor consumo
    return sorted(IAS.values(), key=lambda x: (x["eco_score"], -x["consumo_wh"]), reverse=True)

def simular_impacto(ia_id: str, usos: int = 10):
    ia = IAS[ia_id]
    consumo = ia["consumo_wh"] * usos
    co2_g = consumo * EMISSAO_CO2_G_POR_WH
    alternativas = eco_ranking()
    melhor = next((x for x in alternativas if x["id"] != ia_id and x["consumo_wh"] < ia["consumo_wh"]), alternativas[0])
    economia = max(0.0, ia["consumo_wh"] - melhor["consumo_wh"]) * usos
    return {
        "ia_escolhida": ia_id,
        "usos": usos,
        "consumo_wh": round(consumo, 2),
        "emissao_co2_g": round(co2_g, 2),
        "alternativa_mais_sustentavel": melhor["id"],
        "economia_wh_se_migrar": round(economia, 2),
    }
