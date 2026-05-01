#!/usr/bin/env python3
"""Migration script: converts pokemons_data.json + atlas_sprite_map.json into YAML data files."""

import json
import os
import yaml

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(SCRIPT_DIR)
SRC_DIR = os.path.join(ROOT_DIR, "src", "assets")
PUBLIC_DIR = os.path.join(ROOT_DIR, "public", "data")

POKEMONS_DIR = os.path.join(PUBLIC_DIR, "pokemons")
SECTIONS_DIR = os.path.join(PUBLIC_DIR, "sections")
INDEX_PATH = os.path.join(PUBLIC_DIR, "index.yaml")

REGION_NAMES = {
    "kanto": "Kanto Region Forms",
    "johto": "Johto Region Forms",
    "hoenn": "Hoenn Region Forms",
    "sinnoh": "Sinnoh Form",
    "unova": "Unova Form",
    "kalos": "Kalos Form",
    "alola": "Alolan Forms",
    "galar": "Galarian Forms",
    "hisui": "Hisuian Forms",
    "paldea": "Paldean Forms",
    "gmax": "Gigantamax",
}

GENERATIONS = [
    {"id": "1", "title": "Generation I", "subtitle": "Kanto", "first": 1, "last": 151, "regions": ["kanto"]},
    {"id": "2", "title": "Generation II", "subtitle": "Johto", "first": 152, "last": 251, "regions": ["johto"]},
    {"id": "3", "title": "Generation III", "subtitle": "Hoenn", "first": 252, "last": 386, "regions": ["hoenn"]},
    {"id": "4", "title": "Generation IV", "subtitle": "Sinnoh", "first": 387, "last": 493, "regions": ["sinnoh"]},
    {"id": "5", "title": "Generation V", "subtitle": "Unova", "first": 494, "last": 649, "regions": ["unova"]},
    {"id": "6", "title": "Generation VI", "subtitle": "Kalos", "first": 650, "last": 721, "regions": ["kalos"]},
    {"id": "7", "title": "Generation VII", "subtitle": "Alola", "first": 722, "last": 809, "regions": ["alola"]},
    {"id": "8", "title": "Generation VIII", "subtitle": "Galar", "first": 810, "last": 905, "regions": ["galar", "hisui", "gmax"]},
    {"id": "9", "title": "Generation IX", "subtitle": "Paldea", "first": 906, "last": 1025, "regions": ["paldea"]},
]

VARIETIES_IGNORE = [25, 201, 493, 676, 666, 669, 670, 671, 773, 869]

SPECIAL_SPECIES = [
    (25, "Cap Pikachu"),
    (201, "Unown"),
    (676, "Furfrou"),
    (666, "Vivillon"),
    (None, "Florges"),  # ids 669, 670, 671
    (869, "Alcremie"),
]

NATURES = [
    "Hardy", "Lonely", "Adamant", "Naughty", "Brave",
    "Bold", "Docile", "Impish", "Lax", "Relaxed",
    "Modest", "Mild", "Bashful", "Rash", "Quiet",
    "Calm", "Gentle", "Careful", "Quirky", "Sassy",
    "Timid", "Hasty", "Jolly", "Naive", "Serious",
]

STARTER_IDS = [
    1, 4, 7, 650, 653, 656,
    152, 155, 158, 722, 725, 728,
    252, 255, 258, 810, 813, 816,
    387, 390, 393, 906, 909, 912,
    495, 498, 501,
]

EEVEE_IDS = [133, 134, 135, 136, 196, 197, 470, 471, 700]


def load_json(path):
    with open(path) as f:
        return json.load(f)


def display_name(p):
    if p.get("subTitle") and p["subTitle"] != "":
        return f"{p['title']} {p['subTitle']}"
    return p["title"]


def atlas_coords(image_path, sprite_map):
    if image_path in sprite_map:
        entry = sprite_map[image_path]
        return {"sheet": entry["sheet"], "x": entry["x"], "y": entry["y"]}
    return {"sheet": 0, "x": 0, "y": 0}


def pokemon_detail(p, sprite_map):
    return {
        "uuid": p["uuid"],
        "national_id": p["id"],
        "name": display_name(p),
        "types": p["types"],
        "image": atlas_coords(p["imagePath"], sprite_map),
        "evolutions": [],
    }


def pokemon_entry(p, sprite_map):
    return {
        "id": p["id"],
        "uuid": p["uuid"],
        "name": display_name(p),
        "types": p["types"],
        "image": atlas_coords(p["imagePath"], sprite_map),
    }


def write_yaml(path, data):
    with open(path, "w") as f:
        yaml.dump(data, f, default_flow_style=None, allow_unicode=True, sort_keys=False, width=200)


def main():
    data = load_json(os.path.join(SRC_DIR, "pokemons_data.json"))
    sprite_map = load_json(os.path.join(SRC_DIR, "atlas_sprite_map.json"))

    default_pokemons = data["defaultPokemons"]
    default_females = data["defaultFemalePokemons"]
    varieties = data["varieties"]

    # Build lookup maps
    id_to_default = {p["id"]: p for p in default_pokemons}

    os.makedirs(POKEMONS_DIR, exist_ok=True)
    os.makedirs(SECTIONS_DIR, exist_ok=True)

    # --- Build search index ---
    search_index = []

    # --- Write pokemon detail files ---
    all_pokemons = default_pokemons + default_females + varieties
    for p in all_pokemons:
        detail = pokemon_detail(p, sprite_map)
        filepath = os.path.join(POKEMONS_DIR, f"{p['uuid']}.yaml")
        write_yaml(filepath, detail)

    print(f"Written {len(all_pokemons)} pokemon detail files")

    # --- Build section files ---
    section_files = []

    for gen in GENERATIONS:
        gen_title = gen["title"]
        first, last = gen["first"], gen["last"]
        regions = gen["regions"]
        file_id = gen["id"]
        tags = gen["regions"] + [f"gen{file_id}"]
        sub_sections = []

        # Default sub-section
        default_entries = [
            pokemon_entry(p, sprite_map)
            for p in default_pokemons
            if first <= p["id"] <= last
        ]
        sub_sections.append({"title": "Default", "pokemons": default_entries})

        for p in default_pokemons:
            if first <= p["id"] <= last:
                search_index.append({
                    "name": display_name(p),
                    "uuid": p["uuid"],
                    "id": p["id"],
                    "types": p["types"],
                    "image": atlas_coords(p["imagePath"], sprite_map),
                    "section": gen_title,
                    "sub_section": "Default",
                })

        # Females sub-section
        female_entries = [
            pokemon_entry(p, sprite_map)
            for p in default_females
            if first <= p["id"] <= last
        ]
        if female_entries:
            sub_sections.append({"title": "Females", "pokemons": female_entries})
        for p in default_females:
            if first <= p["id"] <= last:
                search_index.append({
                    "name": display_name(p),
                    "uuid": p["uuid"],
                    "id": p["id"],
                    "types": p["types"],
                    "image": atlas_coords(p["imagePath"], sprite_map),
                    "section": gen_title,
                    "sub_section": "Females",
                })

        # Varieties (non-special, region=null)
        non_special_varieties = [
            pokemon_entry(p, sprite_map)
            for p in varieties
            if first <= p["id"] <= last and p["region"] is None and p["id"] not in VARIETIES_IGNORE
        ]
        if non_special_varieties:
            sub_sections.append({"title": "Varieties", "pokemons": non_special_varieties})
        for p in varieties:
            if first <= p["id"] <= last and p["region"] is None and p["id"] not in VARIETIES_IGNORE:
                search_index.append({
                    "name": display_name(p),
                    "uuid": p["uuid"],
                    "id": p["id"],
                    "types": p["types"],
                    "image": atlas_coords(p["imagePath"], sprite_map),
                    "section": gen_title,
                    "sub_section": "Varieties",
                })

        # Special species sub-sections
        for species_id, species_title in SPECIAL_SPECIES:
            if species_id is None:
                species_ids = [669, 670, 671]
                check_id = species_ids[0]
            else:
                species_ids = [species_id]
                check_id = species_id

            if check_id < first or check_id > last:
                continue

            special_entries = [
                pokemon_entry(p, sprite_map)
                for p in varieties
                if p["id"] in species_ids and p["region"] is None
            ]
            if special_entries:
                sub_sections.append({"title": species_title, "pokemons": special_entries})
            for p in varieties:
                if p["id"] in species_ids and p["region"] is None and first <= p["id"] <= last:
                    search_index.append({
                        "name": display_name(p),
                        "uuid": p["uuid"],
                        "id": p["id"],
                        "types": p["types"],
                        "image": atlas_coords(p["imagePath"], sprite_map),
                        "section": gen_title,
                        "sub_section": species_title,
                    })

        # Regional form sub-sections (one per region)
        for region in regions:
            regional_entries = [
                pokemon_entry(p, sprite_map)
                for p in varieties
                if p["region"] == region
            ]
            region_title = REGION_NAMES.get(region, region)
            if regional_entries:
                sub_sections.append({"title": region_title, "pokemons": regional_entries})
            for p in varieties:
                if p["region"] == region:
                    search_index.append({
                        "name": display_name(p),
                        "uuid": p["uuid"],
                        "id": p["id"],
                        "types": p["types"],
                        "image": atlas_coords(p["imagePath"], sprite_map),
                        "section": gen_title,
                        "sub_section": region_title,
                    })

        section_data = {
            "title": gen_title,
            "tags": tags,
            "sub_sections": sub_sections,
        }

        section_path = os.path.join(SECTIONS_DIR, f"generation-{gen['id']}.yaml")
        write_yaml(section_path, section_data)
        section_files.append(section_path)

    # --- Extra Credits section ---
    ditto = id_to_default[132]
    ditto_image = atlas_coords(ditto["imagePath"], sprite_map)
    ditto_entries = []
    for nature in NATURES:
        ditto_uuid = f"{ditto['id']}-{nature.lower()}"
        ditto_entries.append({
            "id": ditto["id"],
            "uuid": ditto_uuid,
            "name": nature,
            "types": ditto["types"],
            "image": ditto_image,
        })
        # Write detail file for Ditto
        detail = {
            "uuid": ditto_uuid,
            "national_id": ditto["id"],
            "name": nature,
            "types": ditto["types"],
            "image": ditto_image,
            "evolutions": [],
        }
        write_yaml(os.path.join(POKEMONS_DIR, f"{ditto_uuid}.yaml"), detail)
        search_index.append({
            "name": nature,
            "uuid": ditto_uuid,
            "id": ditto["id"],
            "types": ditto["types"],
            "image": ditto_image,
            "section": "Extra Credits",
            "sub_section": "Dittoes",
        })

    starter_entries = []
    for sid in STARTER_IDS:
        sp = id_to_default[sid]
        s_uuid = f"{sp['id']}-starter"
        s_image = atlas_coords(sp["imagePath"], sprite_map)
        s_name = sp["title"]
        starter_entries.append({
            "id": sp["id"],
            "uuid": s_uuid,
            "name": s_name,
            "types": sp["types"],
            "image": s_image,
        })
        detail = {
            "uuid": s_uuid,
            "national_id": sp["id"],
            "name": s_name,
            "types": sp["types"],
            "image": s_image,
            "evolutions": [],
        }
        write_yaml(os.path.join(POKEMONS_DIR, f"{s_uuid}.yaml"), detail)
        search_index.append({
            "name": s_name,
            "uuid": s_uuid,
            "id": sp["id"],
            "types": sp["types"],
            "image": s_image,
            "section": "Extra Credits",
            "sub_section": "Starters",
        })

    eevee_entries = []
    for eid in EEVEE_IDS:
        ep = id_to_default[eid]
        e_uuid = f"{ep['id']}-starter"
        e_image = atlas_coords(ep["imagePath"], sprite_map)
        e_name = ep["title"]
        eevee_entries.append({
            "id": ep["id"],
            "uuid": e_uuid,
            "name": e_name,
            "types": ep["types"],
            "image": e_image,
        })
        detail = {
            "uuid": e_uuid,
            "national_id": ep["id"],
            "name": e_name,
            "types": ep["types"],
            "image": e_image,
            "evolutions": [],
        }
        write_yaml(os.path.join(POKEMONS_DIR, f"{e_uuid}.yaml"), detail)
        search_index.append({
            "name": e_name,
            "uuid": e_uuid,
            "id": ep["id"],
            "types": ep["types"],
            "image": e_image,
            "section": "Extra Credits",
            "sub_section": "Eeveelutions",
        })

    extra_section = {
        "title": "Extra Credits",
        "tags": ["extra", "special"],
        "sub_sections": [
            {"title": "Dittoes", "pokemons": ditto_entries},
            {"title": "Starters", "pokemons": starter_entries},
            {"title": "Eeveelutions", "pokemons": eevee_entries},
        ],
    }
    write_yaml(os.path.join(SECTIONS_DIR, "extra-credits.yaml"), extra_section)

    # Write search index
    write_yaml(INDEX_PATH, search_index)

    print(f"Written {len(section_files)} generation section files + extra-credits.yaml")
    print(f"Written search index with {len(search_index)} entries")
    print("Done!")


if __name__ == "__main__":
    main()
