/* Local prototype interactions for Campusly. No account or server data is used. */
(function () {
  "use strict";

  var page = document.body.dataset.page;
  var today = new Date();
  var todayKey = dateKey(today);
  var seedTasks = [
    { id: "t1", title: "Finish AI Assignment", due: "2026-11-20", done: false },
    { id: "t2", title: "HTML Interface Due", due: "2026-11-05", done: true },
    { id: "t3", title: "M7 Assignment", due: "2026-11-11", done: false },
    { id: "t4", title: "Homework 4", due: "2026-11-15", done: false },
    { id: "t5", title: "Accounting Assignment", due: "2026-11-26", done: false }
  ];
  var seedEvents = [
    ["2026-11-02", "14:00", "Club Meeting", "event"],
    ["2026-11-03", "09:00", "BI Midterm", "assignment"],
    ["2026-11-05", "17:00", "HTML Interface Due", "assignment"],
    ["2026-11-06", "10:00", "Career Fair", "event"],
    ["2026-11-09", "10:00", "Study Group", "event"],
    ["2026-11-09", "13:00", "Math Practice", "assignment"],
    ["2026-11-09", "16:00", "Club Meeting", "event"],
    ["2026-11-10", "11:00", "Library Workshop", "event"],
    ["2026-11-11", "17:00", "M7 Assignment", "assignment"],
    ["2026-11-11", "14:00", "Project Check-in", "event"],
    ["2026-11-12", "15:00", "Project Meeting", "event"],
    ["2026-11-13", "11:00", "Guest Lecture", "event"],
    ["2026-11-13", "15:00", "Quiz Review", "assignment"],
    ["2026-11-14", "13:00", "Club Event Prep", "event"],
    ["2026-11-15", "17:00", "Homework 4 Due", "assignment"],
    ["2026-11-17", "10:00", "Resume Workshop", "event"],
    ["2026-11-20", "17:00", "AI Assignment Due", "assignment"],
    ["2026-11-24", "13:00", "Team Presentation", "event"],
    ["2026-11-26", "17:00", "Accounting Assignment Due", "assignment"],
    ["2026-11-27", "09:00", "Volunteer Day", "event"],
    ["2026-11-30", "10:00", "Exam Prep", "assignment"]
  ].map(function (entry, index) {
    return { id: "e" + index, date: entry[0], time: entry[1], title: entry[2], kind: entry[3] };
  });
  var seedPosts = [
    { id: "p1", author: "Alex Chen", date: "Nov 13", category: "Class", title: "Class is cancelled today", body: "Our professor announced that today's class is cancelled. Enjoy the extra time to catch up or take a break.", likes: 24, liked: false, comments: [] },
    { id: "p2", author: "Sofia Kim", date: "Nov 13", category: "Class", title: "Looking for a study partner", body: "I'm still working on the problem set. Let me know if you'd like to review it together before the deadline.", likes: 7, liked: false, comments: [{ author: "Daniel", body: "I can meet after the lecture." }] },
    { id: "p3", author: "Daniel Park", date: "Nov 12", category: "Campus", title: "Free popcorn at the student association", body: "The student association is giving out popcorn in the main building lobby this afternoon.", likes: 32, liked: false, comments: [] }
  ];

  function readStore(key, fallback) {
    try {
      var value = JSON.parse(localStorage.getItem(key));
      return Array.isArray(value) ? value : fallback;
    } catch (error) {
      return fallback;
    }
  }
  function writeStore(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (error) { /* Prototype still works for this visit. */ }
  }
  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character];
    });
  }
  function dateKey(date) {
    return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0");
  }
  function parseDate(key) {
    var parts = key.split("-").map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }
  function displayDate(key, options) {
    return new Intl.DateTimeFormat("en", options || { month: "short", day: "numeric" }).format(parseDate(key));
  }
  function icon(name) {
    return '<svg aria-hidden="true"><use href="assets/icons.svg#' + name + '"></use></svg>';
  }
  function newId() { return "custom-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8); }
  function sortByDate(a, b) { return (a.due || a.date).localeCompare(b.due || b.date) || (a.time || "").localeCompare(b.time || ""); }

  var tasks = readStore("campusly-tasks-v1", seedTasks);
  var events = readStore("campusly-events-v1", seedEvents);
  var posts = readStore("campusly-posts-v1", seedPosts);

  document.querySelectorAll("[data-open-dialog]").forEach(function (button) {
    button.addEventListener("click", function () {
      var dialog = document.getElementById(button.dataset.openDialog);
      if (dialog) dialog.showModal();
    });
  });
  document.querySelectorAll("[data-close-dialog]").forEach(function (button) {
    button.addEventListener("click", function () { button.closest("dialog").close(); });
  });
  document.querySelectorAll("dialog").forEach(function (dialog) {
    dialog.addEventListener("click", function (event) { if (event.target === dialog) dialog.close(); });
  });
  document.addEventListener("change", function (event) {
    var checkbox = event.target.closest("[data-task-id]");
    if (!checkbox || checkbox.type !== "checkbox") return;
    var task = tasks.find(function (item) { return item.id === checkbox.dataset.taskId; });
    if (!task) return;
    task.done = checkbox.checked;
    writeStore("campusly-tasks-v1", tasks);
    if (page === "home") renderHome();
    if (page === "todo") renderTasks();
  });

  function renderHome() {
    var openTasks = tasks.filter(function (task) { return !task.done; }).sort(sortByDate);
    var next = document.getElementById("next-deadline");
    if (next) {
      document.querySelector(".spotlight .eyebrow").textContent = openTasks.length && openTasks[0].due < todayKey ? "Needs attention" : "Next deadline";
      next.innerHTML = openTasks.length
        ? '<div class="rule-date"><h2>' + escapeHtml(openTasks[0].title) + '</h2><p>' + (openTasks[0].due < todayKey ? "Overdue · " : "Due ") + escapeHtml(displayDate(openTasks[0].due, { weekday: "long", month: "long", day: "numeric" })) + '</p></div>'
        : '<div class="rule-date"><h2>All caught up</h2><p>No open tasks right now</p></div>';
    }
    var list = document.getElementById("home-task-list");
    if (list) {
      list.innerHTML = openTasks.slice(0, 4).map(function (task) {
        return '<li class="mini-task"><input type="checkbox" data-task-id="' + escapeHtml(task.id) + '" aria-label="Complete ' + escapeHtml(task.title) + '"><label>' + escapeHtml(task.title) + '</label><time datetime="' + escapeHtml(task.due) + '">' + escapeHtml(displayDate(task.due)) + '</time></li>';
      }).join("") || '<li class="task-empty">No open tasks</li>';
    }
    var upcoming = events.filter(function (event) { return event.date >= todayKey; }).sort(sortByDate).slice(0, 3);
    renderAgenda(document.getElementById("home-agenda"), upcoming);
  }
  function renderAgenda(container, list) {
    if (!container) return;
    container.innerHTML = list.map(function (event) {
      return '<div class="agenda-item"><div class="agenda-date"><span>' + escapeHtml(displayDate(event.date, { weekday: "short" })) + '</span><strong>' + escapeHtml(parseDate(event.date).getDate()) + '</strong></div><div class="agenda-body"><h3>' + escapeHtml(event.title) + '</h3><p>' + escapeHtml(event.time) + ' · ' + (event.kind === "assignment" ? "Assignment" : "Campus event") + '</p></div></div>';
    }).join("") || '<p class="muted">No events coming up</p>';
  }

  var feedFilter = "all";
  var feedQuery = new URLSearchParams(location.search).get("q") || "";
  function renderFeed() {
    var input = document.getElementById("site-search");
    if (input) input.value = feedQuery;
    var matching = posts.filter(function (post) {
      var categoryMatch = feedFilter === "all" || post.category === feedFilter;
      var queryMatch = !feedQuery || (post.author + " " + post.title + " " + post.body).toLowerCase().includes(feedQuery.toLowerCase());
      return categoryMatch && queryMatch;
    });
    document.getElementById("feed-count").textContent = matching.length + (matching.length === 1 ? " post" : " posts");
    document.getElementById("post-list").innerHTML = matching.map(function (post) {
      var initials = post.author.split(/\s+/).slice(0, 2).map(function (part) { return part[0] || ""; }).join("").toUpperCase();
      var avatarColor = post.category === "Campus" ? " gold" : " green";
      return '<article class="card post" id="' + escapeHtml(post.id) + '">'
        + '<div class="post-top"><span class="avatar' + avatarColor + '">' + escapeHtml(initials) + '</span><div><div class="post-author">' + escapeHtml(post.author) + '</div><div class="post-meta">' + escapeHtml(post.date) + '</div></div><span class="post-category">' + escapeHtml(post.category) + '</span></div>'
        + '<h2>' + escapeHtml(post.title) + '</h2><p>' + escapeHtml(post.body) + '</p>'
        + '<div class="post-actions"><button class="post-action" type="button" data-like="' + escapeHtml(post.id) + '" aria-pressed="' + post.liked + '">' + icon("heart") + '<span>' + post.likes + '</span> Like</button>'
        + '<button class="post-action" type="button" data-comment-toggle="' + escapeHtml(post.id) + '">' + icon("message") + '<span>' + post.comments.length + '</span> Comment</button>'
        + '<button class="post-action" type="button" data-share="' + escapeHtml(post.id) + '">' + icon("share") + ' Share</button></div>'
        + '<div class="comment-panel" data-comment-panel="' + escapeHtml(post.id) + '" hidden><div class="comment-list">' + post.comments.map(function (comment) { return '<div class="comment"><strong>' + escapeHtml(comment.author) + '</strong> ' + escapeHtml(comment.body) + '</div>'; }).join("") + '</div><form class="comment-form" data-comment-form="' + escapeHtml(post.id) + '"><label class="sr-only" for="comment-' + escapeHtml(post.id) + '">Write a comment</label><input class="input" id="comment-' + escapeHtml(post.id) + '" name="comment" maxlength="240" placeholder="Write a comment" required><button class="button button-secondary" type="submit">Post</button></form></div></article>';
    }).join("") || '<div class="card feed-empty">No posts match your search. Try another term or category.</div>';
  }
  if (page === "home") {
    renderHome();
    renderFeed();
    document.querySelectorAll("[data-feed-filter]").forEach(function (button) {
      button.addEventListener("click", function () {
        feedFilter = button.dataset.feedFilter;
        document.querySelectorAll("[data-feed-filter]").forEach(function (item) { item.setAttribute("aria-pressed", String(item === button)); });
        renderFeed();
      });
    });
    document.getElementById("post-list").addEventListener("click", function (event) {
      var likeButton = event.target.closest("[data-like]");
      var commentButton = event.target.closest("[data-comment-toggle]");
      var shareButton = event.target.closest("[data-share]");
      if (likeButton) {
        var post = posts.find(function (item) { return item.id === likeButton.dataset.like; });
        post.liked = !post.liked;
        post.likes += post.liked ? 1 : -1;
        writeStore("campusly-posts-v1", posts);
        renderFeed();
      } else if (commentButton) {
        var panel = document.querySelector('[data-comment-panel="' + commentButton.dataset.commentToggle + '"]');
        panel.hidden = !panel.hidden;
        if (!panel.hidden) panel.querySelector("input").focus();
      } else if (shareButton) {
        var url = location.href.split("#")[0] + "#" + shareButton.dataset.share;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(function () { shareButton.textContent = "Link copied"; }).catch(function () { shareButton.textContent = "Copy unavailable"; });
        } else {
          shareButton.textContent = "Copy unavailable";
        }
      }
    });
    document.getElementById("post-list").addEventListener("submit", function (event) {
      var form = event.target.closest("[data-comment-form]");
      if (!form) return;
      event.preventDefault();
      var post = posts.find(function (item) { return item.id === form.dataset.commentForm; });
      var comment = form.elements.comment.value.trim();
      if (!comment) return;
      post.comments.push({ author: "You", body: comment });
      writeStore("campusly-posts-v1", posts);
      renderFeed();
      var panel = document.querySelector('[data-comment-panel="' + post.id + '"]');
      if (panel) panel.hidden = false;
    });
    document.getElementById("post-form").addEventListener("submit", function (event) {
      event.preventDefault();
      var form = event.currentTarget;
      posts.unshift({ id: newId(), author: form.elements.author.value.trim(), date: displayDate(todayKey), category: form.elements.category.value, title: form.elements.title.value.trim(), body: form.elements.body.value.trim(), likes: 0, liked: false, comments: [] });
      writeStore("campusly-posts-v1", posts);
      feedFilter = "all";
      feedQuery = "";
      history.replaceState(null, "", location.pathname);
      document.querySelectorAll("[data-feed-filter]").forEach(function (item) { item.setAttribute("aria-pressed", String(item.dataset.feedFilter === "all")); });
      form.reset();
      document.getElementById("post-dialog").close();
      renderFeed();
    });
  }

  var taskFilter = "open";
  function renderTasks() {
    var open = tasks.filter(function (task) { return !task.done; }).length;
    var done = tasks.length - open;
    var percent = tasks.length ? Math.round(done / tasks.length * 100) : 0;
    document.getElementById("task-open-count").textContent = open;
    document.getElementById("task-progress-label").textContent = done + " of " + tasks.length + " completed";
    document.getElementById("task-progress").setAttribute("aria-valuenow", percent);
    document.getElementById("task-progress-fill").style.width = percent + "%";
    var matching = tasks.filter(function (task) { return taskFilter === "all" || (taskFilter === "done" ? task.done : !task.done); }).sort(sortByDate);
    document.getElementById("task-list").innerHTML = matching.map(function (task) {
      return '<li class="task-row"><input type="checkbox" data-task-id="' + escapeHtml(task.id) + '" id="task-' + escapeHtml(task.id) + '"' + (task.done ? ' checked' : '') + '><div><label class="task-title" for="task-' + escapeHtml(task.id) + '">' + escapeHtml(task.title) + '</label><span class="task-detail">' + (task.done ? 'Completed' : task.due < todayKey ? 'Needs attention' : 'Upcoming') + '</span></div><time class="task-due' + (!task.done && task.due < todayKey ? ' overdue' : '') + '" datetime="' + escapeHtml(task.due) + '">' + (task.due < todayKey && !task.done ? 'Overdue · ' : '') + escapeHtml(displayDate(task.due)) + '</time><button class="button button-quiet button-icon" type="button" data-delete-task="' + escapeHtml(task.id) + '" aria-label="Delete ' + escapeHtml(task.title) + '">' + icon("trash") + '</button></li>';
    }).join("") || '<li class="task-empty">No tasks in this view</li>';
  }
  if (page === "todo") {
    renderTasks();
    document.querySelectorAll("[data-task-filter]").forEach(function (button) {
      button.addEventListener("click", function () {
        taskFilter = button.dataset.taskFilter;
        document.querySelectorAll("[data-task-filter]").forEach(function (item) { item.setAttribute("aria-pressed", String(item === button)); });
        renderTasks();
      });
    });
    document.getElementById("task-form").addEventListener("submit", function (event) {
      event.preventDefault();
      var form = event.currentTarget;
      tasks.push({ id: newId(), title: form.elements.title.value.trim(), due: form.elements.due.value, done: false });
      writeStore("campusly-tasks-v1", tasks);
      taskFilter = "open";
      document.querySelectorAll("[data-task-filter]").forEach(function (item) { item.setAttribute("aria-pressed", String(item.dataset.taskFilter === "open")); });
      form.reset();
      document.getElementById("task-dialog").close();
      renderTasks();
    });
    document.getElementById("task-list").addEventListener("click", function (event) {
      var button = event.target.closest("[data-delete-task]");
      if (!button) return;
      var task = tasks.find(function (item) { return item.id === button.dataset.deleteTask; });
      if (!task || !confirm('Delete "' + task.title + '"?')) return;
      tasks = tasks.filter(function (item) { return item.id !== task.id; });
      writeStore("campusly-tasks-v1", tasks);
      renderTasks();
    });
  }

  if (page === "calendar-month" || page === "calendar-week") {
    var isWeek = page === "calendar-week";
    var params = new URLSearchParams(location.search);
    var selected = /^\d{4}-\d{2}-\d{2}$/.test(params.get("date") || "") ? parseDate(params.get("date")) : new Date(2026, 10, isWeek ? 9 : 1);
    if (isNaN(selected.getTime())) selected = new Date(2026, 10, 1);
    function startOfWeek(date) {
      var result = new Date(date);
      result.setDate(result.getDate() - ((result.getDay() + 6) % 7));
      return result;
    }
    function renderCalendar() {
      var grid = document.getElementById("calendar-grid");
      grid.classList.toggle("week-grid", isWeek);
      var first = isWeek ? startOfWeek(selected) : new Date(selected.getFullYear(), selected.getMonth(), 1);
      var start = new Date(first);
      if (!isWeek) start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
      var count = isWeek ? 7 : Math.ceil(((first.getDay() + 6) % 7 + new Date(selected.getFullYear(), selected.getMonth() + 1, 0).getDate()) / 7) * 7;
      var end = new Date(start);
      end.setDate(end.getDate() + count - 1);
      document.getElementById("calendar-title").textContent = isWeek
        ? displayDate(dateKey(start), { month: "short", day: "numeric" }) + " – " + displayDate(dateKey(end), { month: "short", day: "numeric", year: "numeric" })
        : new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(selected);
      document.querySelector(".topbar-context .muted").textContent = "/ " + document.getElementById("calendar-title").textContent;
      document.getElementById("agenda-period").textContent = isWeek ? "This week" : new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(selected);
      document.querySelectorAll(".view-switch a").forEach(function (link) {
        link.href = (link.getAttribute("aria-current") === "page" ? (isWeek ? "calendar-week.html" : "calendar.html") : (isWeek ? "calendar.html" : "calendar-week.html")) + "?date=" + dateKey(selected);
      });
      var html = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(function (day, index) {
        var label = isWeek ? day + "<strong>" + (new Date(start.getFullYear(), start.getMonth(), start.getDate() + index)).getDate() + "</strong>" : day;
        return '<div class="day-head">' + label + '</div>';
      }).join("");
      for (var i = 0; i < count; i++) {
        var day = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
        var key = dateKey(day);
        var dayEvents = events.filter(function (event) { return event.date === key; }).sort(sortByDate);
        var outside = !isWeek && day.getMonth() !== selected.getMonth();
        var limit = isWeek ? 9 : 2;
        html += '<div class="calendar-day' + (outside ? ' outside' : '') + (key === todayKey ? ' today' : '') + '" aria-label="' + escapeHtml(displayDate(key, { weekday: "long", month: "long", day: "numeric", year: "numeric" })) + '">'
          + '<span class="day-number">' + day.getDate() + '</span>'
          + dayEvents.slice(0, limit).map(function (event) { return '<span class="event-chip' + (event.kind === "assignment" ? ' assignment' : '') + '" title="' + escapeHtml(event.title + " · " + event.time) + '">' + (isWeek ? escapeHtml(event.time) + " · " : "") + escapeHtml(event.title) + '</span>'; }).join("")
          + (dayEvents.length > limit ? '<span class="muted" style="font-size:11px">+' + (dayEvents.length - limit) + ' more</span>' : '') + '</div>';
      }
      grid.innerHTML = html;
      var visible = events.filter(function (event) { return event.date >= dateKey(start) && event.date <= dateKey(end); }).sort(sortByDate);
      renderAgenda(document.getElementById("calendar-agenda"), visible.slice(0, 5));
    }
    renderCalendar();
    document.getElementById("calendar-prev").addEventListener("click", function () {
      if (isWeek) selected.setDate(selected.getDate() - 7);
      else selected.setMonth(selected.getMonth() - 1, 1);
      history.replaceState(null, "", location.pathname + "?date=" + dateKey(selected));
      renderCalendar();
    });
    document.getElementById("calendar-next").addEventListener("click", function () {
      if (isWeek) selected.setDate(selected.getDate() + 7);
      else selected.setMonth(selected.getMonth() + 1, 1);
      history.replaceState(null, "", location.pathname + "?date=" + dateKey(selected));
      renderCalendar();
    });
    document.getElementById("event-form").addEventListener("submit", function (event) {
      event.preventDefault();
      var form = event.currentTarget;
      events.push({ id: newId(), date: form.elements.date.value, time: form.elements.time.value, title: form.elements.title.value.trim(), kind: form.elements.kind.value });
      writeStore("campusly-events-v1", events);
      selected = parseDate(form.elements.date.value);
      history.replaceState(null, "", location.pathname + "?date=" + dateKey(selected));
      form.reset();
      document.getElementById("event-dialog").close();
      renderCalendar();
    });
  }

  if (page === "login") {
    document.getElementById("login-form").addEventListener("submit", function (event) {
      event.preventDefault();
      document.getElementById("login-status").textContent = "Sign-in is not connected in this prototype. Explore the sample pages using the navigation.";
    });
  }
})();
