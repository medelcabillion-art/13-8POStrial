// ───────────────────────── ICONS (inline SVG, no external deps) ─────────────────────────
  const ICONS = {
    coffee: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>',
    glass: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3h14l-1.5 16.5A2 2 0 0 1 15.5 21h-7a2 2 0 0 1-2-1.5L5 3Z"/><path d="M6 8h12"/></svg>',
    croissant: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 17.5 9 12l3 3 5.5-5.5"/><path d="M12.5 4.5C16 1 21 6 18 10c3 1 4 6-1 7-1 3-6 4-8-1-5 2-9-4-5-7-2-3 2-7 5.5-4.5Z"/></svg>',
    icecream: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 17a5 5 0 0 0 5-5H7a5 5 0 0 0 5 5Z"/><path d="m12 17 -2 5h4l-2-5Z"/><circle cx="12" cy="7" r="5"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  };

  // ───────────────────────── MENU ─────────────────────────
  const MENU = [
    {
      category: "Espresso",
      icon: "coffee",
      items: [
        { id: "esp-1", name: "Espresso", price: 95 },
        { id: "esp-2", name: "Americano", price: 110 },
        { id: "esp-3", name: "Cortado", price: 125 },
        { id: "esp-4", name: "Flat White", price: 135 },
        { id: "esp-5", name: "Cappuccino", price: 130 },
        { id: "esp-6", name: "Caffè Latte", price: 140 },
      ],
    },
    {
      category: "Cold Brew",
      icon: "glass",
      items: [
        { id: "cb-1", name: "Cold Brew", price: 145 },
        { id: "cb-2", name: "Iced Latte", price: 150 },
        { id: "cb-3", name: "Vietnamese Iced Coffee", price: 155 },
        { id: "cb-4", name: "Nitro Cold Brew", price: 165 },
      ],
    },
    {
      category: "Pastries",
      icon: "croissant",
      items: [
        { id: "pa-1", name: "Butter Croissant", price: 95 },
        { id: "pa-2", name: "Pain au Chocolat", price: 105 },
        { id: "pa-3", name: "Banana Loaf Slice", price: 90 },
        { id: "pa-4", name: "Cheese Roll", price: 65 },
      ],
    },
    {
      category: "Extras",
      icon: "icecream",
      items: [
        { id: "ex-1", name: "Affogato", price: 150 },
        { id: "ex-2", name: "Oat Milk Sub", price: 25 },
        { id: "ex-3", name: "Extra Shot", price: 35 },
        { id: "ex-4", name: "Vanilla Syrup", price: 20 },
      ],
    },
  ];

  // Local print bridge — see thirteen-eight-print-server. Change the port
  // here if you set SERVER_PORT to something else in server.js.
  const PRINT_SERVER_URL = "http://localhost:9100/print";

  // ───────────────────────── STATE ─────────────────────────
  let activeCategory = MENU[0].category;
  let cart = []; // {id, name, price, qty}
  let orderNumber = 108;
  let completedTotal = null;
  let printStatus = null; // null | "printing" | "ok" | "error"
  let lastCash = null;
  let lastChange = null;

  // ───────────────────────── HELPERS ─────────────────────────
  function peso(n) {
    return n.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function getSubtotal() {
    return cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  }
  function getTax() {
    return getSubtotal() * 0.12;
  }
  function getTotal() {
    return getSubtotal() + getTax();
  }
  function getItemCount() {
    return cart.reduce((sum, c) => sum + c.qty, 0);
  }

  // ───────────────────────── RENDER: TABS ─────────────────────────
  function renderTabs() {
    const tabsEl = document.getElementById("tabs");
    tabsEl.innerHTML = "";
    MENU.forEach((cat) => {
      const btn = document.createElement("button");
      btn.className = "tab" + (cat.category === activeCategory ? " active" : "");
      btn.innerHTML = ICONS[cat.icon] + cat.category;
      btn.addEventListener("click", () => {
        activeCategory = cat.category;
        renderTabs();
        renderItemGrid();
      });
      tabsEl.appendChild(btn);
    });
  }

  // ───────────────────────── RENDER: ITEM GRID ─────────────────────────
  function renderItemGrid() {
    const gridEl = document.getElementById("item-grid");
    gridEl.innerHTML = "";
    const activeItems = MENU.find((m) => m.category === activeCategory)?.items ?? [];
    activeItems.forEach((item) => {
      const card = document.createElement("button");
      card.className = "item-card";
      card.innerHTML = `
        <div class="name">${item.name}</div>
        <div class="price">₱${peso(item.price)}</div>
      `;
      card.addEventListener("click", () => addItem(item));
      gridEl.appendChild(card);
    });
  }

  // ───────────────────────── CART ACTIONS ─────────────────────────
  function addItem(item) {
    completedTotal = null;
    const existing = cart.find((c) => c.id === item.id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ ...item, qty: 1 });
    }
    renderTicket();
  }

  function changeQty(id, delta) {
    completedTotal = null;
    cart = cart
      .map((c) => (c.id === id ? { ...c, qty: c.qty + delta } : c))
      .filter((c) => c.qty > 0);
    renderTicket();
  }

  function removeItem(id) {
    completedTotal = null;
    cart = cart.filter((c) => c.id !== id);
    renderTicket();
  }

  // ───────────────────────── RENDER: TICKET ─────────────────────────
  function renderTicket() {
    document.getElementById("ticket-no-display").textContent =
      "Ticket No. " + String(orderNumber).padStart(4, "0");

    const count = getItemCount();
    document.getElementById("item-count").textContent =
      count + (count === 1 ? " item" : " items");

    const lineItemsEl = document.getElementById("line-items");
    lineItemsEl.innerHTML = "";

    if (cart.length === 0) {
      lineItemsEl.innerHTML =
        '<div class="empty-ticket">Tap a menu item to start<br />this ticket.</div>';
    } else {
      cart.forEach((c) => {
        const row = document.createElement("div");
        row.className = "line-item";
        row.innerHTML = `
          <div class="line-item-top">
            <span class="name">${c.name}</span>
            <span class="price">₱${peso(c.price * c.qty)}</span>
          </div>
          <div class="line-item-controls">
            <button class="qty-btn" data-action="dec" aria-label="Decrease ${c.name} quantity">${ICONS.minus}</button>
            <span class="qty-value">${c.qty}</span>
            <button class="qty-btn" data-action="inc" aria-label="Increase ${c.name} quantity">${ICONS.plus}</button>
            <button class="remove-btn" data-action="remove" aria-label="Remove ${c.name}">${ICONS.trash}</button>
          </div>
        `;
        row.querySelector('[data-action="dec"]').addEventListener("click", () => changeQty(c.id, -1));
        row.querySelector('[data-action="inc"]').addEventListener("click", () => changeQty(c.id, 1));
        row.querySelector('[data-action="remove"]').addEventListener("click", () => removeItem(c.id));
        lineItemsEl.appendChild(row);
      });
    }

    const subtotal = getSubtotal();
    const tax = getTax();
    const total = getTotal();

    document.getElementById("subtotal-value").textContent = "₱" + peso(subtotal);
    document.getElementById("tax-value").textContent = "₱" + peso(tax);
    document.getElementById("total-value").textContent = "₱" + peso(total);

    const chargeBtn = document.getElementById("charge-btn");
    chargeBtn.textContent = "Charge ₱" + peso(total);
    chargeBtn.disabled = cart.length === 0;

    renderConfirmation();
  }

  function renderConfirmation() {
    const el = document.getElementById("confirmation");
    if (completedTotal === null) {
      el.style.display = "none";
      return;
    }
    el.style.display = "block";
    el.className = "confirmation" + (printStatus === "error" ? " error" : "");

    let html = `<div>✓ Order #${String(orderNumber - 1).padStart(4, "0")} paid — ₱${peso(completedTotal)}</div>`;
    if (lastCash !== null) {
      html += `<div>Cash ₱${peso(lastCash)} · Change ₱${peso(lastChange)}</div>`;
    }
    if (printStatus === "printing") html += "<div>Printing receipt…</div>";
    if (printStatus === "ok") html += "<div>Receipt printed</div>";
    if (printStatus === "error") html += "<div>Couldn't reach the printer — is the print server running?</div>";

    el.innerHTML = html;
  }

  // ───────────────────────── PAYMENT MODAL ─────────────────────────
  const modalOverlay = document.getElementById("modal-overlay");
  const cashInput = document.getElementById("cash-given-input");
  const confirmBtn = document.getElementById("confirm-payment-btn");

  function openPayment() {
    if (cart.length === 0) return;
    cashInput.value = "";
    document.getElementById("modal-amount").textContent = "₱" + peso(getTotal());
    renderQuickCash();
    updateChangeDisplay();
    modalOverlay.classList.add("open");
    setTimeout(() => cashInput.focus(), 0);
  }

  function cancelPayment() {
    modalOverlay.classList.remove("open");
    cashInput.value = "";
  }

  function renderQuickCash() {
    const total = getTotal();
    const quickCashEl = document.getElementById("quick-cash");
    quickCashEl.innerHTML = "";

    const options = [total, ...[100, 200, 500, 1000].filter((v) => v >= total)].slice(0, 4);
    options.forEach((v, i) => {
      const btn = document.createElement("button");
      btn.textContent = i === 0 ? "Exact" : "₱" + v;
      btn.addEventListener("click", () => {
        cashInput.value = v;
        updateChangeDisplay();
      });
      quickCashEl.appendChild(btn);
    });
  }

  function updateChangeDisplay() {
    const total = getTotal();
    const cashGivenNum = parseFloat(cashInput.value) || 0;
    const changeDue = cashGivenNum - total;

    const changeValueEl = document.getElementById("change-value");
    if (changeDue >= 0) {
      changeValueEl.textContent = "₱" + peso(changeDue);
      changeValueEl.classList.remove("negative");
    } else {
      changeValueEl.textContent = "−₱" + peso(Math.abs(changeDue));
      changeValueEl.classList.add("negative");
    }

    confirmBtn.disabled = cashGivenNum < total;
  }

  cashInput.addEventListener("input", updateChangeDisplay);

  async function confirmPayment() {
    const total = getTotal();
    const subtotal = getSubtotal();
    const tax = getTax();
    const cashGivenNum = parseFloat(cashInput.value) || 0;
    if (cashGivenNum < total) return;

    const changeDue = cashGivenNum - total;

    const order = {
      orderNumber,
      timestamp: Date.now(),
      items: cart.map((c) => ({ name: c.name, qty: c.qty, price: c.price })),
      subtotal,
      tax,
      total,
      cashGiven: cashGivenNum,
      change: changeDue,
    };

    completedTotal = total;
    lastCash = cashGivenNum;
    lastChange = changeDue;
    cart = [];
    orderNumber += 1;
    modalOverlay.classList.remove("open");
    cashInput.value = "";

    renderTicket();

    printStatus = "printing";
    renderConfirmation();

    try {
      const res = await fetch(PRINT_SERVER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
      if (!res.ok) throw new Error("Print server responded with an error.");
      printStatus = "ok";
    } catch (err) {
      // Most common cause: the local print-server.js isn't running on this PC,
      // or (if deployed to https) the browser blocked the http:// call.
      printStatus = "error";
    }
    renderConfirmation();
  }

  document.getElementById("charge-btn").addEventListener("click", openPayment);
  document.getElementById("cancel-payment-btn").addEventListener("click", cancelPayment);
  document.getElementById("confirm-payment-btn").addEventListener("click", confirmPayment);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) cancelPayment();
  });

  // ───────────────────────── INIT ─────────────────────────
  renderTabs();
  renderItemGrid();
  renderTicket();