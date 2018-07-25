var producers, genders, gps, gender_folder, symbols, affect;

gender_folder = "../assets/gender/";
symbols = {
    "no gender today": {
        "img": "",
        "affect": 1
    },
    "male": {
        "img": gender_folder + "male.svg",
        "affect": 0.4
    },
    "female": {
        "img": gender_folder + "female.svg",
        "affect": 0.8
    },
    "bigender": {
        "img": gender_folder + "bigender.svg",
        "affect": 1.1
    },
    "agender": {
        "img": gender_folder + "agender.svg",
        "affect": 1.2
    },
    "third gender": {
        "img": gender_folder + "third_gender.svg",
        "affect": 1.4
    },
    "neutrois": {
        "img": gender_folder + "neutrois.svg",
        "affect": 1.3
    },
    "androgyne": {
        "img": gender_folder + "androgyne.svg",
        "affect": 1.3
    },
    "demiboy": {
        "img": gender_folder + "demiboy.svg",
        "affect": 1.5
    },
    "demigirl": {
        "img": gender_folder + "demigirl.svg",
        "affect": 1.6
    },
    "demibigender": {
        "img": gender_folder + "demibigender.svg",
        "affect": 1.9
    }
};
affect = 1;


function load() {
    if (typeof(Storage) !== "undefined") {
        if (localStorage.producers) {
            producers = JSON.parse(localStorage.producers);
        } else {
            producers = {
                "binary": {
                    "count": 0,
                    "produce": 0.1,
                    "cost": 10,
                    "base_cost": 10,
                    "modifier": 1,
                    "singular": "binary genders",
                    "plural": "binary genders"
                },
                "lgbt": {
                    "count": 0,
                    "produce": 1,
                    "cost": 50,
                    "base_cost": 50,
                    "modifier": 1.1,
                    "singular": "lgbt",
                    "plural": "blts"
                },
                "mogai": {
                    "count": 0,
                    "produce": 5,
                    "cost": 100,
                    "base_cost": 100,
                    "modifier": 1.17,
                    "singular": "mogai",
                    "plural": "mogai"
                },
                "lab": {
                    "count": 0,
                    "produce": 5,
                    "cost": 100,
                    "base_cost": 100,
                    "modifier": 1.3,
                    "singular": "gender lab",
                    "plural": "gender labs"
                },
                "pride": {
                    "count": 0,
                    "produce": 10,
                    "cost": 400,
                    "base_cost": 400,
                    "modifier": 1.41,
                    "singular": "pride-flags",
                    "plural": "pride-flags"
                },
                "two": {
                    "count": 0,
                    "produce": 20,
                    "cost": 750,
                    "base_cost": 750,
                    "modifier": 1.56,
                    "singular": "gender 2.0",
                    "plural": "gender 2.0"
                },
                "beyond": {
                    "count": 0,
                    "produce": 25,
                    "cost": 1000,
                    "base_cost": 1000,
                    "modifier": 1.666,
                    "singular": "beyond-mogai",
                    "plural": "beyond-mogai"
                },
                "arco": {
                    "count": 0,
                    "produce": 40,
                    "cost": 1500,
                    "base_cost": 1500,
                    "modifier": 1.72,
                    "singular": "arco-pluris",
                    "plural": "arco-pluris"
                }
            };
        }
        if (localStorage.genders) {
            genders = Number(localStorage.genders);
        } else {
            genders = 0;
        }
        if (localStorage.gps) {
            gps = Number(localStorage.gps);
        } else {
            gps = 0;
        }
    } else {
        alert("your browser does not support webstorage, you will be unable to save your game.")
    }
}

function save() {
    console.log("saved");
    localStorage.producers = JSON.stringify(producers);
    localStorage.genders = genders;
    localStorage.gps = gps;
}

function g_round(i, n) {
    return Math.round(i * Math.pow(10, n)) / Math.pow(10, n);
}

function gender_of_the_day() {
    var gender = Object.keys(symbols)[Math.floor(Math.random() * (Object.keys(symbols).length - 1))];
    var god = $("#god");

    affect = symbols[gender]["affect"];
    $("#god-caption").text(gender.replace("_", " "));
    god.attr("src", symbols[gender]["img"]);
    god.attr("title", gender);
    god.attr("alt", gender);
    $("#affect").text("currently providing a " + affect + "x multiplier to gender income.");

    $("#clicker-gps").text(g_round(gps * affect, 2) + " genders/second (base production of " + g_round(gps, 2) + ")");
}

function addGenders(cnt) {
    genders += cnt;
    var gender = $("#clicker-genders");
    if (genders > 1 || genders === 0) {
        gender.text(g_round(genders, 2) + " genders");
    } else {
        gender.text(g_round(genders, 2) + " gender");
    }
}

function cost_update(name) {
    return g_round((producers[name]["base_cost"] * Math.pow(1.1, producers[name]["count"])) * producers[name]["modifier"], 0);
}

function buy(name) {
    if (name in producers) {
        if (genders >= producers[name]["cost"]) {
            addGenders(-producers[name]["cost"]);
            var cost = $("#cost-" + name);
            var count = $("#count-" + name);
            gps += producers[name]["produce"];
            producers[name]["count"] += 1;
            producers[name]["cost"] = cost_update(name);
            if (producers[name]["count"] > 1 || producers[name]["count"] === 0) {
                count.text(producers[name]["count"] + " " + producers[name]["plural"]);
            } else {
                count.text(producers[name]["count"] + " " + producers[name]["singular"]);
            }
            cost.text(producers[name]["cost"]);
            $("#clicker-gps").text(g_round(gps * affect, 2)
                                   + " genders/second (base production of "
                                   + g_round(gps, 2)
                                   + ")"
            );
        }
    }
}

$(document).ready(
    function () {
        load();
        for (var key in producers) {
            if (key !== "binary") {
                producers[key]["cost"] = Math.ceil(
                    Math.pow(
                        Object.keys(producers).indexOf(key) * producers["binary"]["cost"], 2.1
                    ) / 25) * 25;
                producers[key]["base_cost"] = producers[key]["cost"];
            }
            var cost = $("#cost-" + key);
            var count = $("#count-" + key);
            cost.text(producers[key]["cost"]);
            count.text(producers[key]["count"] + " " + producers[key]["plural"]);
        }
        gender_of_the_day()
    }
);

$("#tumblr").click(
    function () {
        addGenders(1);
        if (Math.random() < 0.005) {
            gender_of_the_day();
        }
    }
);

$("#shop").find("li").click(
    function () {
        buy(this.id);
    }
);

window.setInterval(function () {
    addGenders(gps * affect / 10);
    if (Math.random() < 0.01) {
        gender_of_the_day();
    }
}, 100);

window.setInterval(function () {
    save();
}, 60000);