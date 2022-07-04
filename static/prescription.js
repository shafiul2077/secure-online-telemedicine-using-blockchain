$(document).ready(function() {
	Date.prototype.calcDate = function(days) {
		let date = new Date(this.valueOf());
		date.setDate(date.getDate() + days);
		return `(Untill ${date.getUTCDate()}-${date.getUTCMonth() +
			1}-${date.getUTCFullYear()})`;
	};
  let timeout;
	function snackSaving() {
		let snack = document.getElementById("snacking");
		snack.className = "show";
    timeout = setTimeout(() => {
      alert('ERR: Conection timeout.')
    }, 8000);
	}
	function snackSaved() {
    clearTimeout(timeout);
		let snack = document.getElementById("snacking");
		snack.className = snack.className.replace("show", "");
		let snacked = document.getElementById("snacked");
		snacked.className = "show";
		setTimeout(function() {
			snacked.className = snacked.className.replace("show", "");
		}, 1500);
	}
	$("[data-toggle=tooltip]").tooltip("show");
	setTimeout(function() {
		$("[data-toggle=tooltip]").tooltip("hide");
	}, 5000); //hide tooltips after 5sec
	$(document).keyup(function() {
		$("[data-toggle=tooltip]").tooltip("hide");
	}); //hide tooltip while typing
	$(document).on("focusin keypress", ".med_name", function(e) {
		let x = $(this).siblings("div.med_name_action");
		if (e.type == "focusin") {
			x.css("display", "block");
		}
		if (e.type == "keypress") {
			if (e.keyCode == 13) x.children("button.save").click();
		}
	});

	$(document).on("click", ".cancel-btn", function() {
		$(this)
			.parent()
			.css("display", "none"); //hides save/cancel btn
	});
	$(document).on("click", ".med_name_action button.save", function() {
		$(this)
			.parent()
			.css("display", "none");
		$(".sc_time").removeClass("folded");
	});
	$(".med_name").keypress(function(e) {
		if (e.which == 13) {
			$("#symp_save").click();
		}
	});

	$(document).on("mousedown", ".sc", function(e) {
		let x = $(this).siblings("div.med_when_action");
		x.css("display", "block");
	});
	$(document).on("click", ".med_when_action button.save", function() {
		$(this)
			.parent()
			.css("display", "none");
		$(".select").removeClass("folded");
	});
	$("select.sc").change(function() {
		let x = $(this).siblings("div.med_when_action");
		x.css("display", "none");
	});

	$(document).on("mousedown", ".meal", function() {
		let x = $(this).siblings("div.med_meal_action");
		x.css("display", "block");
	});
	$(document).on("click", ".med_meal_action button.save", function() {
		$(this)
			.parent()
			.css("display", "none");
		$(".period").removeClass("folded");
	});

	$(document).on("focusin keypress", ".med_period", function(e) {
		let x = $(this).siblings("div.med_period_action");
		if (e.type == "focusin") {
			x.css("display", "block");
		}
		if (e.type == "keypress") {
			if (e.keyCode == 13) x.children("button.save").click();
		}
	});
	$(document).on("click", ".med_period_action button.save", function() {
		$(this)
			.parent()
			.css("display", "none");
	});
	$(document).on("keyup", ".med_period", function() {
		let period = $(this).val();
		let num = +period.match(/\d+/g)[0];
		let type = period.match(/\b(\w)/g)[1];
		let days = null;
		if (type == "d") days = num;
		else if (type == "w") days = num * 7;
		else if (type == "m") days = num * 30;
		else if (type == "y") days = num * 365;
		let span = $(this).siblings("span.date");
		if (days) {
			let date = new Date().calcDate(days);
			span.html(date);
		} else {
			span.html("(Invalid time period)");
		}
	});

	$(".sc").keyup(function(e) {
		if (isNaN(e.key)) return;
		let el = $(this);
		el = el
			.val()
			.split("-")
			.join("");
		let finalVal = el.match(/.{1,1}/g).join("-");
		$(this).val(finalVal);
	});
	function initLi(e) {
		let txt = e.target.innerHTML;
		if (!txt.includes("<li>")) {
			let el = "<li></li>";
			$(this).append(el);
		}
	}
	$(".symptoms ul").focusin(initLi);
	$(".symptoms ul").keyup(function(e) {
		let fl = $(this)
			.children()
			.first();
		let el = `<li>${e.target.textContent}</li>`;
		if (fl.text().length < 1) {
			$(this).html("");
			$(this).append(el);
		}
	});
	$("#symp_save").click(function() {
		$(".symp_action").css("display", "none");
	});

	$(".tests ul").focusin(initLi);
	$(".tests ul").keyup(function() {
		let fl = $(this)
			.children()
			.first();
		let el = "<li></li>";
		if (fl.text().length < 1) {
			$(this).html("");
			$(this).append(el);
		}
	});
	$("#test_save").click(function() {
		$(".test_action").css("display", "none");
	});

	$(".symptoms ul").focusin(function() {
		$(".symp_action").css("display", "block");
	});

	$(".tests ul").focusin(function() {
		$(".test_action").css("display", "block");
	});

	$(".advice p").focusin(function() {
		$(".adv_action").css("display", "block");
	});

	$("#adv_save").click(function() {
		$(".adv_action").css("display", "none");
	});
	
	$(document).on("click", ".delete", function() {
		let parent = $(this).closest(".med");
		parent.remove();
	});
	
	let med_id = 1;
	$("#add_med").click(function() {
		med_id++;
		let sourceTemplate = $("#new_medicine").html();
		Mustache.parse(sourceTemplate);
		let sourceHTML = Mustache.render(sourceTemplate, { med_id });
		let medicine = $(".med_list");
		medicine.append(sourceHTML);
	})
});