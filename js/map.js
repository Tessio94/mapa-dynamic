(function ($) {
	var FlexiMapPlugin = {
		lang: "hr",

		pixelPercentWidth: 1,
		pixelPercentHeight: 1,

		init: function (options) {
			this.image = this.find("img.background");
			$(this.image)
				.one("load", function () {
					this.imageWidth = $(this).prop("naturalWidth");
					this.imageHeight = $(this).prop("naturalHeight");
					FlexiMapPlugin.pixelPercentWidth = parseInt(this.imageWidth) / 100;
					FlexiMapPlugin.pixelPercentHeight = parseInt(this.imageHeight) / 100;

					if (FlexiMapPlugin.lang === "hr") {
						$(".bottom, .top").find(".fleximap-lang-en").hide();
					} else {
						$(".bottom, .top").find(".fleximap-lang-hr").hide();
					}

					$(this)
						.parent()
						.find(".fleximap-point")
						.each(function () {
							$this = $(this);
							var Type = $this.data("type");

							// image preload
							if ($this.data("icon-hr")) {
								$("<img />")
									.attr("src", $this.data("icon-hr"))
									.appendTo("body")
									.css("display", "none");
							}
							if ($this.data("icon-en")) {
								$("<img />")
									.attr("src", $this.data("icon-en"))
									.appendTo("body")
									.css("display", "none");
							}

							var LeftPos =
								parseInt($this.data("posx")) / FlexiMapPlugin.pixelPercentWidth;
							var TopPos =
								parseInt($this.data("posy")) /
								FlexiMapPlugin.pixelPercentHeight;

							if (LeftPos == 0 && TopPos == 0) {
								$this.html(
									'<img src="' +
										$this.data("icon-" + FlexiMapPlugin.lang) +
										'" />'
								);
								$this.css("width", "100%");
								$this.children("img").css("width", "100%");
							} else {
								$this.css("left", LeftPos + "%");
								$this.css("top", TopPos + "%");
								if ($this.data("icon-" + FlexiMapPlugin.lang)) {
									$this.html(
										'<img src="' +
											$this.data("icon-" + FlexiMapPlugin.lang) +
											'" />'
									);
									$this
										.children("img")
										.one("load", function () {
											$this = $(this);
											var ImageWidth = $this.parent().width();
											var ImageHeight = $this.parent().height();
											$this
												.parent()
												.css("margin-left", "-" + ImageWidth / 2 + "px");
											$this
												.parent()
												.css("margin-top", "-" + ImageHeight / 2 + "px");
										})
										.each(function () {
											if (this.complete) $(this).load();
										});
								} else {
									var Width = $this.width();
									var Height = $this.height();
									$this.css("margin-left", "-" + Width / 2 + "px");
									$this.css("margin-top", "-" + Height / 2 + "px");
								}
							}

							var DataContainer = $(this).data("cont");

							if (FlexiMapPlugin.lang == "hr") {
								$("#" + DataContainer)
									.find(".fleximap-lang-hr")
									.css("display", "block");
								$("#" + DataContainer)
									.find(".fleximap-lang-en")
									.css("display", "none");
							} else {
								$("#" + DataContainer)
									.find(".fleximap-lang-hr")
									.css("display", "none");
								$("#" + DataContainer)
									.find(".fleximap-lang-en")
									.css("display", "block");
							}

							if (Type == "tooltip") {
								var Data = $("#" + DataContainer).html();
								$this.data("tipso", Data);

								$this.tipso({ tooltipHover: true }).click(function () {
									$(this).tipso("show");
									return false;
								});
							} else if (Type == "popup") {
								$this.fancybox({
									padding: 0,
									fitToView: true,
								});
								$this.attr("href", "#" + DataContainer);
							} else {
								$this.click(function () {
									return false;
								});
							}
						});
				})
				.each(function () {
					if (this.complete) $(this).load();
				});
			$("#map-container").flexiMap("resizeIcons");
			return this;
		},

		toggleLang: function () {
			if (FlexiMapPlugin.lang === "hr") {
				FlexiMapPlugin.lang = "en";
				$(".bottom, .top").find(".fleximap-lang-hr").hide();
				$(".bottom, .top").find(".fleximap-lang-en").show();
				jQuery(".tipso1").tipso("update", "content", "Port of Zadar Authority");
				jQuery(".tipso2").tipso("update", "content", "Virtual Tour");
			} else {
				FlexiMapPlugin.lang = "hr";
				$(".bottom, .top").find(".fleximap-lang-en").hide();
				$(".bottom, .top").find(".fleximap-lang-hr").show();
				jQuery(".tipso1").tipso("update", "content", "Lučka uprava Zadar");
				jQuery(".tipso2").tipso("update", "content", "Virtualna šetnja");
			}

			this.find(".fleximap-point").each(function () {
				var $this = $(this);
				if ($this.data("icon-" + FlexiMapPlugin.lang)) {
					$this.html(
						'<img src="' + $this.data("icon-" + FlexiMapPlugin.lang) + '" />'
					);
					$this
						.children("img")
						.one("load", function () {
							var $this = $(this);
							if (
								$this.parent().data("posx") != 0 &&
								$this.parent().data("posy")
							) {
								var ImageWidth = $this.width();
								var ImageHeight = $this.height();
								$this.parent().css("margin-left", "-" + ImageWidth / 2 + "px");
								$this.parent().css("margin-top", "-" + ImageHeight / 2 + "px");
							} else {
								$this.css("width", "100%");
							}
						})
						.each(function () {
							if (this.complete) $(this).load();
						})
						.promise()
						.done($("#map-container").flexiMap("resizeIcons"));
				}

				var DataContainer = $(this).data("cont");
				if (FlexiMapPlugin.lang == "hr") {
					$("#" + DataContainer)
						.find(".fleximap-lang-hr")
						.css("display", "block");
					$("#" + DataContainer)
						.find(".fleximap-lang-en")
						.css("display", "none");
				} else {
					$("#" + DataContainer)
						.find(".fleximap-lang-hr")
						.css("display", "none");
					$("#" + DataContainer)
						.find(".fleximap-lang-en")
						.css("display", "block");
				}

				if ($this.data("type") == "tooltip") {
					var Data = $("#" + DataContainer)
						.find(".fleximap-lang-" + FlexiMapPlugin.lang)
						.html();
					$this.data("tipso", Data);
				}
			});

			this.find(".fleximap-lang-change").html(
				'<img src="' +
					this.find(".fleximap-lang-change").data(
						"icon-" + FlexiMapPlugin.lang
					) +
					'" />'
			);

			//$(this).flexiMap('resizeIcons');
		},

		toggleIcons: function (iconClass) {
			this.find("." + iconClass).each(function () {
				$this = $(this);
				if ($this.hasClass("fleximap-shown")) {
					$this.removeClass("fleximap-shown");
					//$this.css('display', 'none');
					$this.fadeOut(400);
				} else {
					$this.addClass("fleximap-shown");
					//$this.css('display', 'block');
					$this.fadeIn(400);
				}
			});
			$(this).flexiMap("resizeIcons");
		},

		resizeIcons: function () {
			var WindowWidth = $(window).width();
			var Factor = 1;
			var VezFactor = 0.8;
			var CrtaFactor = 0.75;
			if (WindowWidth < 768) {
				Factor = 0.7;
			} else if (WindowWidth < 992) {
				Factor = 0.75;
			} else if (WindowWidth < 1200) {
				Factor = 0.8;
			} else if (WindowWidth < 1400) {
				Factor = 0.85;
			} else if (WindowWidth < 1600) {
				Factor = 0.9;
			}

			this.find(".fleximap-point").each(function () {
				var $this = $(this);

				if ($this.data("posx") != 0 && $this.data("posy") != 0) {
					var $Image = $this.children("img");
					var ImageWidth = $Image.prop("naturalWidth");

					var ImageHeight = $Image.prop("naturalHeight");

					if (
						$this.hasClass("fleximap-notdefault-1") &&
						!$this.hasClass("infobutton")
					) {
						ImageWidth = ImageWidth * Factor * VezFactor;
						ImageHeight = ImageHeight * Factor * VezFactor;
					} else if ($this.hasClass("fleximap-notdefault-6")) {
						ImageWidth = ImageWidth * Factor * CrtaFactor;
						ImageHeight = ImageHeight * Factor * CrtaFactor;
					} else if ($this.hasClass("fleximap-notdefault-11")) {
						ImageWidth = ImageWidth * Factor * CrtaFactor;
						ImageHeight = ImageHeight * Factor * CrtaFactor;
					} else {
						ImageWidth = ImageWidth * Factor;
						ImageHeight = ImageHeight * Factor;
					}

					$Image.parent().css("width", ImageWidth + "px");
					$Image.parent().css("height", ImageHeight + "px");
					$Image.css("width", ImageWidth + "px");
					$Image.css("height", ImageHeight + "px");
					$Image.parent().css("margin-left", "-" + ImageWidth / 2 + "px");
					$Image.parent().css("margin-top", "-" + ImageHeight / 2 + "px");
				}
			});
		},
	};

	$.fn.flexiMap = function (methodOrOptions) {
		if (FlexiMapPlugin[methodOrOptions]) {
			return FlexiMapPlugin[methodOrOptions].apply(
				this,
				Array.prototype.slice.call(arguments, 1)
			);
		} else if (typeof methodOrOptions === "object" || !methodOrOptions) {
			// Default to "init"
			return FlexiMapPlugin.init.apply(this, arguments);
		} else {
			$.error(
				"Method " + methodOrOptions + " does not exist on jQuery.tooltip"
			);
		}
	};
})(jQuery);

$(document).ready(function () {
	$("#map-container").flexiMap();

	$(window).resize(function () {
		$("#map-container").flexiMap("resizeIcons");
	});
});
