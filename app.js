/* Ghoont — shared behaviour across pages */
(function () {
  "use strict";

  var KEY = "ghoont_cart_v1";
  var FREE_SHIPPING = 999;
  var SHIPPING = 79;

  /* ---------- product data (kept in sync by the build script) ---------- */
  var P = {
    matcha:  { name: "Matcha",   dev: "माचा",   kicker: "Ceremonial · first harvest", bg: "var(--blush)",  price: 1199, size: "30g" },
    hojicha: { name: "Hojicha",  dev: "होजिचा", kicker: "Roasted · low caffeine",     bg: "var(--sand)",   price: 699,  size: "30g" },
    ube:     { name: "Ube",      dev: "ऊबे",    kicker: "Barista grade · Philippines", bg: "var(--lilac)",  price: 799,  size: "30g" },
    kit:     { name: "The Kit",  dev: "पूरा सेट", kicker: "Whisk · bowl · sieve · scoop", bg: "var(--leafbg)", price: 2899, size: "Full set" },
    sachets: { name: "Sachets",  dev: "पुड़िया",  kicker: "Ceremonial · 10 × 2g",       bg: "var(--rose)",   price: 649,  size: "10 × 2g" }
  };
  var ORDER = ["matcha", "hojicha", "ube", "kit", "sachets"];

  /* ---------- storage with graceful fallback ---------- */
  var memory = {};
  function load() {
    try {
      var raw = window.localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return memory;
    }
  }
  function save(c) {
    memory = c;
    try { window.localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {}
  }

  var cart = load();
  var inr = function (n) { return "₹" + n.toLocaleString("en-IN"); };

  /* ---------- header badge ---------- */
  function badge() {
    var n = 0;
    for (var k in cart) { n += cart[k]; }
    var el = document.getElementById("bagbtn");
    if (el) el.textContent = "Bag (" + n + ")";
  }

  /* ---------- toast ---------- */
  var tt;
  function toast(msg) {
    var el = document.getElementById("toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(tt);
    tt = setTimeout(function () { el.classList.remove("show"); }, 2400);
  }

  /* ---------- mobile menu ---------- */
  var burger = document.getElementById("burger");
  if (burger) {
    burger.addEventListener("click", function () {
      var d = document.getElementById("drawer");
      var open = d.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ---------- brewing dial ---------- */
  var slider = document.getElementById("s");
  if (slider) {
    var t = document.getElementById("t");
    var v = document.getElementById("v");
    var vs = document.getElementById("vs");
    var update = function () {
      var n = +slider.value, head, sub;
      t.innerHTML = n + "<sup>°C</sup>";
      if (n < 70) {
        head = "Too cold"; sub = "Thin and flat, no foam. The sweetness never comes out.";
      } else if (n <= 82) {
        head = "Perfect"; sub = "Sweet, creamy, thick foam. This is what you paid for.";
      } else if (n <= 90) {
        head = "Turning bitter"; sub = "Catechins releasing. The astringency starts about here.";
      } else {
        head = "Grass"; sub = "Scorched. This is the cup that made you think you hate matcha.";
      }
      v.childNodes[0].nodeValue = head;
      vs.textContent = sub;
    };
    slider.addEventListener("input", update);
    update();
  }

  /* ---------- product page: quantity + add to bag ---------- */
  var q = 1;
  var qEl = document.getElementById("q");
  Array.prototype.forEach.call(document.querySelectorAll("[data-q]"), function (b) {
    b.addEventListener("click", function () {
      q = Math.max(1, q + (b.getAttribute("data-q") === "+" ? 1 : -1));
      if (qEl) qEl.textContent = q;
    });
  });

  var addBtn = document.getElementById("addbtn");
  if (addBtn) {
    addBtn.addEventListener("click", function () {
      var id = addBtn.getAttribute("data-add");
      cart[id] = (cart[id] || 0) + q;
      save(cart);
      badge();
      toast(q + " × " + P[id].name + " added to bag");
      addBtn.textContent = "Added";
      addBtn.classList.add("on");
      setTimeout(function () {
        addBtn.textContent = "Add to bag";
        addBtn.classList.remove("on");
      }, 1300);
    });
  }

  /* ---------- FAQ accordion ---------- */
  Array.prototype.forEach.call(document.querySelectorAll(".fq button"), function (b) {
    b.addEventListener("click", function () { b.parentElement.classList.toggle("open"); });
  });

  /* ---------- cart page ---------- */
  var root = document.getElementById("cartroot");
  function renderCart() {
    if (!root) return;
    var ids = ORDER.filter(function (k) { return cart[k] > 0; });

    if (!ids.length) {
      root.innerHTML =
        '<div class="empty"><h2 class="h-md">Your bag is empty</h2>' +
        '<p class="lead centered">Nothing in here yet. The sachets are the easiest place to start.</p>' +
        '<a class="btn mt15" href="shop.html">Shop the range</a></div>';
      return;
    }

    var sub = ids.reduce(function (s, k) { return s + P[k].price * cart[k]; }, 0);
    var ship = sub >= FREE_SHIPPING ? 0 : SHIPPING;

    var lines = ids.map(function (k) {
      var p = P[k];
      return '<div class="ci">' +
        '<div class="thumb" style="background:' + p.bg + '">' + p.dev + '</div>' +
        '<div><h4>' + p.name + '</h4><div class="sm">' + p.kicker + ' · ' + p.size + '</div>' +
        '<div class="sm">' + inr(p.price) + ' each</div></div>' +
        '<div class="cright">' +
          '<div class="qty"><button data-ch="' + k + ':-1" aria-label="Decrease">−</button>' +
          '<span>' + cart[k] + '</span>' +
          '<button data-ch="' + k + ':1" aria-label="Increase">+</button></div>' +
          '<strong style="font-weight:500">' + inr(p.price * cart[k]) + '</strong>' +
          '<button class="rm" data-rm="' + k + '">Remove</button>' +
        '</div></div>';
    }).join("");

    root.innerHTML =
      '<h2 class="h-lg">Your bag</h2><div class="cartgrid"><div>' + lines +
      '<a class="btn gh sm mt14" href="shop.html">Keep shopping</a></div>' +
      '<div class="sumbox">' +
        '<div class="sumrow"><span>Subtotal</span><span>' + inr(sub) + '</span></div>' +
        '<div class="sumrow"><span>Shipping</span><span>' + (ship ? inr(ship) : "Free") + '</span></div>' +
        '<div class="sumrow tot"><span>Total</span><span>' + inr(sub + ship) + '</span></div>' +
        '<button class="btn wide mt12" id="checkout">Checkout</button>' +
        '<p class="ship">' + (ship
            ? "Add " + inr(FREE_SHIPPING - sub) + " more for free shipping."
            : "Free shipping applied.") +
          ' Prepaid orders get 3% off at checkout.</p>' +
      '</div></div>';

    Array.prototype.forEach.call(root.querySelectorAll("[data-ch]"), function (b) {
      b.addEventListener("click", function () {
        var parts = b.getAttribute("data-ch").split(":");
        var k = parts[0];
        cart[k] = Math.max(0, (cart[k] || 0) + parseInt(parts[1], 10));
        if (!cart[k]) delete cart[k];
        save(cart); badge(); renderCart();
      });
    });
    Array.prototype.forEach.call(root.querySelectorAll("[data-rm]"), function (b) {
      b.addEventListener("click", function () {
        delete cart[b.getAttribute("data-rm")];
        save(cart); badge(); renderCart();
      });
    });
    var co = document.getElementById("checkout");
    if (co) co.addEventListener("click", function () {
      toast("Checkout isn't connected yet — this is a prototype");
    });
  }

  badge();
  renderCart();
})();
