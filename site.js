(function () {
  var toggle = document.getElementById("nav-toggle");
  var menuLabel = document.querySelector("label[for='nav-toggle']");
  var dock = document.querySelector(".dock");
  var dockAnchors = document.querySelectorAll(".hero-actions .btn-primary, .enquiry .btn-on-band");

  if (dock && dockAnchors.length && "IntersectionObserver" in window) {
    var seen = new WeakMap();
    var visible = 0;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var was = seen.get(entry.target) || false;
        if (entry.isIntersecting && !was) visible += 1;
        if (!entry.isIntersecting && was) visible -= 1;
        seen.set(entry.target, entry.isIntersecting);
      });
      dock.classList.toggle("is-hidden", visible > 0);
    }, { threshold: 0.5 });
    dockAnchors.forEach(function (anchor) { observer.observe(anchor); });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && toggle && toggle.checked) {
      toggle.checked = false;
      if (menuLabel) menuLabel.focus();
    }
  });

  var form = document.getElementById("enquiry");
  if (!form) return;

  var params = new URLSearchParams(window.location.search);
  var topic = params.get("topic");
  var focus = params.get("focus");
  var select = form.querySelector("[name='topic']");
  var allowed = ["speaking", "workshop", "consulting", "courses", "writing", "media", "briefing"];
  if (select && topic && allowed.indexOf(topic) !== -1) {
    select.value = topic;
  }

  var message = form.querySelector("[name='message']");
  var focusNotes = {
    empathy: "I want the Empathy at Work workshop.",
    generations: "I want the Integrating Generations workshop.",
    everywhere: "I want the Working Everywhere workshop."
  };
  if (message && focus && focusNotes[focus] && !message.value) {
    message.value = focusNotes[focus] + "\n";
  }

  var status = document.getElementById("form-status");

  function fieldWrap(control) {
    return control.closest(".field");
  }

  function setError(control, text) {
    var wrap = fieldWrap(control);
    var slot = wrap.querySelector(".field-error");
    if (text) {
      wrap.classList.add("is-invalid");
      control.setAttribute("aria-invalid", "true");
      slot.textContent = text;
    } else {
      wrap.classList.remove("is-invalid");
      control.removeAttribute("aria-invalid");
      slot.textContent = "";
    }
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var name = form.querySelector("[name='name']");
    var email = form.querySelector("[name='email']");
    var topicField = form.querySelector("[name='topic']");
    var note = form.querySelector("[name='message']");
    var ok = true;

    if (!name.value.trim()) {
      setError(name, "Enter your name.");
      ok = false;
    } else {
      setError(name, "");
    }

    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    if (!emailOk) {
      setError(email, "Enter an email address Sophie can reply to.");
      ok = false;
    } else {
      setError(email, "");
    }

    if (!topicField.value) {
      setError(topicField, "Choose what this enquiry is about.");
      ok = false;
    } else {
      setError(topicField, "");
    }

    if (!note.value.trim()) {
      setError(note, "Tell Sophie what you need.");
      ok = false;
    } else {
      setError(note, "");
    }

    if (!ok) {
      status.textContent = "Check the highlighted fields, then send the enquiry again.";
      var first = form.querySelector(".is-invalid input, .is-invalid select, .is-invalid textarea");
      if (first) first.focus();
      return;
    }

    var org = form.querySelector("[name='organization']").value.trim();
    var phone = form.querySelector("[name='phone']").value.trim();
    var timing = form.querySelector("[name='timing']").value.trim();
    var topicLabel = topicField.options[topicField.selectedIndex].text;
    var lines = [
      "Name: " + name.value.trim(),
      "Email: " + email.value.trim()
    ];
    if (org) lines.push("Organization: " + org);
    if (phone) lines.push("Phone: " + phone);
    lines.push("About: " + topicLabel);
    if (timing) lines.push("Timing: " + timing);
    lines.push("");
    lines.push(note.value.trim());

    var address = ["contact", "sophiewade.com"].join("@");
    var href =
      "mailto:" +
      address +
      "?subject=" +
      encodeURIComponent("Empathyworks enquiry: " + topicLabel) +
      "&body=" +
      encodeURIComponent(lines.join("\n"));

    status.textContent =
      "Your email app should open with this enquiry ready to send. If it does not, call 646.706.7396 and mention " +
      topicLabel +
      ".";
    window.location.href = href;
  });
})();
