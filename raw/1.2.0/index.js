(function () {
  var authWindow;

  async function getLogo(logoUrl, button, text) {
    try {
      const response = await fetch(logoUrl);

      if (!response.ok) {
        throw new Error("Failed to load the logo.");
      }

      const svgData = await response.text();
      return (button.innerHTML = svgData + `<span>${text}</span>`);
    } catch (error) {
      console.error("Error loading logo:", error);
    }
  }

  function handleMessage(event, authOrigin, successCallback) {
    if (event.origin === authOrigin && event.data.is_authenticated) {
      if (typeof window[successCallback] === "function") {
        window[successCallback](event.data); // Call the global callback function
      }

      if (authWindow) {
        authWindow.close();
      }

      window.removeEventListener("message", handleMessage);
    }
  }

  function handleSignIn(
    neynarLoginUrl,
    clientId,
    redirectUri,
    successCallback
  ) {
    var authUrl = new URL(neynarLoginUrl);
    authUrl.searchParams.append("client_id", clientId);
    if (redirectUri) {
      authUrl.searchParams.append("redirect_uri", redirectUri);
    }

    var authOrigin = new URL(neynarLoginUrl).origin;
    authWindow = window.open(authUrl.toString(), "_blank");
    window.addEventListener(
      "message",
      function (event) {
        handleMessage(event, authOrigin, successCallback);
      },
      false
    );
  }

  function createSignInButton(element) {
    var clientId = element.getAttribute("data-client_id");
    var neynarLoginUrl =
      element.getAttribute("data-neynar_login_url") ??
      "https://app.neynar.com/login";
    var redirectUri = element.getAttribute("data-redirect_uri");
    var successCallback =
      element.getAttribute("data-success_callback") ??
      element.getAttribute("data-success-callback");
    var theme = element.getAttribute("data-theme");
    var variant = element.getAttribute("data-variant");
    var height = element.getAttribute("data-height");
    var width = element.getAttribute("data-width");
    var borderRadius = element.getAttribute("data-border_radius");
    var fontSize = element.getAttribute("data-font_size");
    var fontWeight = element.getAttribute("data-font_weight");
    var padding = element.getAttribute("data-padding");
    var margin = element.getAttribute("data-margin");
    var text = element.getAttribute("data-text");
    var color = element.getAttribute("data-color");
    var backgroundColor = element.getAttribute("data-background_color");
    var customLogoUrl = element.getAttribute("data-custom_logo_url");
    var logoSize = element.getAttribute("data-logo_size") ?? "30px";
    var styles = element.getAttribute("data-styles");

    var farcasterLogo = `<svg width="${logoSize}" height="${logoSize}" viewBox="0 0 225 225" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="225" height="225" rx="50" fill="#855DCD"/>
      <path d="M58 35H167V190H151V119H150.843C149.075 99.3773 132.583 84 112.5 84C92.4169 84 75.9253 99.3773 74.157 119H74V190H58V35Z" fill="white"/>
      <path d="M29 57L35.5 79H41V168C38.2386 168 36 170.239 36 173V179H35C32.2386 179 30 181.239 30 184V190H86V184C86 181.239 83.7614 179 81 179H80V173C80 170.239 77.7614 168 75 168H69V57H29Z" fill="white"/>
      <path d="M152 168C149.239 168 147 170.239 147 173V179H146C143.239 179 141 181.239 141 184V190H197V184C197 181.239 194.761 179 192 179H191V173C191 170.239 188.761 168 186 168V79H191.5L198 57H158V168H152Z" fill="white"/>
      </svg>`;

    var warpcastLogo = `<svg width="${logoSize}" height="${logoSize}" viewBox="0 0 1260 1260" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_1_2)">
      <path d="M947.747 1259.61H311.861C139.901 1259.61 0 1119.72 0 947.752V311.871C0 139.907 139.901 0.00541362 311.861 0.00541362H947.747C1119.71 0.00541362 1259.61 139.907 1259.61 311.871V947.752C1259.61 1119.72 1119.71 1259.61 947.747 1259.61Z" fill="#472A91"></path>
      <path d="M826.513 398.633L764.404 631.889L702.093 398.633H558.697L495.789 633.607L433.087 398.633H269.764L421.528 914.36H562.431L629.807 674.876L697.181 914.36H838.388L989.819 398.633H826.513Z" fill="white"></path>
      </g>
      <defs>
      <clipPath id="clip0_1_2">
      <rect width="1259.61" height="1259.61" fill="white">
      </rect>
      </clipPath></defs></svg>`;

    var neynarLogo = `<svg width="${logoSize}" height="${logoSize}" viewBox="200 250 900 900" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M490.853 690C490.853 799.905 579.948 889 689.853 889C799.757 889 888.853 799.905 888.853 690C888.853 580.095 799.757 491 689.853 491C579.948 491 490.853 580.095 490.853 690Z" fill="white"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M689.853 877.759C586.156 877.759 502.094 793.696 502.094 690C502.094 586.304 586.156 502.241 689.853 502.241C793.549 502.241 877.612 586.304 877.612 690C877.612 793.696 793.549 877.759 689.853 877.759ZM689.853 889C579.948 889 490.853 799.905 490.853 690C490.853 580.095 579.948 491 689.853 491C799.757 491 888.853 580.095 888.853 690C888.853 799.905 799.757 889 689.853 889Z" fill="#855DCD"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M490.932 695.693C545.518 717.779 605.241 737.841 668.511 754.794C734.683 772.525 799.197 785.371 859.854 793.497C824.914 850.767 761.848 889 689.852 889C581.851 889 493.945 802.965 490.932 695.693Z" fill="white"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M490.932 695.693C545.518 717.779 605.241 737.841 668.511 754.794C734.683 772.525 799.197 785.371 859.854 793.497C824.914 850.767 761.848 889 689.852 889C581.851 889 493.945 802.965 490.932 695.693Z" fill="url(#paint0_linear_1_140)"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M490.932 695.693C491.049 699.863 491.294 704.002 491.664 708.104C500.811 809.524 586.05 889 689.852 889C757.388 889 817.067 855.357 853.043 803.915C855.418 800.518 857.69 797.044 859.854 793.497C855.801 792.954 851.731 792.39 847.644 791.805C790.567 783.633 730.261 771.34 668.511 754.794C609.631 739.017 553.823 720.548 502.368 700.261C498.532 698.748 494.719 697.225 490.932 695.693ZM503.458 712.761C514.69 805.721 593.86 877.759 689.852 877.759C751.506 877.759 806.23 848.048 840.473 802.122C784.593 793.891 725.763 781.772 665.601 765.652C608.305 750.299 553.87 732.408 503.458 712.761Z" fill="#855DCD"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M526.99 571.065C490.029 565.733 456.13 562.541 426.456 561.505C389.388 560.211 360.284 562.339 340.429 567.152C330.488 569.563 324.129 572.352 320.46 574.776C318.873 575.824 318.078 576.599 317.709 577.034C317.811 577.595 318.112 578.665 318.962 580.366C320.928 584.299 325.04 589.894 332.444 596.952C347.232 611.048 371.373 627.443 404.122 644.857C469.268 679.496 563.661 715.65 671.741 744.61C779.822 773.57 879.646 789.456 953.383 792.031C990.452 793.325 1019.56 791.197 1039.41 786.383C1049.35 783.973 1055.71 781.184 1059.38 778.76C1060.97 777.712 1061.76 776.936 1062.13 776.501C1062.03 775.94 1061.73 774.871 1060.88 773.17C1058.91 769.236 1054.8 763.641 1047.4 756.584C1032.61 742.487 1008.47 726.093 975.717 708.679C951.371 695.734 922.941 682.577 891.238 669.664C890.845 665.775 890.338 661.894 889.718 658.026C888.823 652.442 887.695 646.907 886.34 641.435C1013.52 691.471 1095.45 746.818 1085.8 782.844C1072.27 833.321 884.068 826.75 665.43 768.166C446.791 709.582 280.514 621.17 294.04 570.692C303.881 533.963 406.206 527.438 545.444 549.177C538.797 556.013 532.628 563.325 526.99 571.065ZM317.665 576.547C317.662 576.545 317.657 576.586 317.662 576.671C317.671 576.591 317.669 576.548 317.665 576.547ZM1062.41 776.101C1062.41 776.1 1062.38 776.136 1062.35 776.211C1062.4 776.139 1062.42 776.102 1062.41 776.101ZM1062.18 776.864C1062.17 776.945 1062.17 776.988 1062.17 776.989C1062.18 776.99 1062.18 776.95 1062.18 776.864ZM317.487 577.325C317.44 577.397 317.424 577.434 317.427 577.435C317.431 577.435 317.454 577.4 317.487 577.325Z" fill="white"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M533.007 585.337L537.714 578.876C542.981 571.645 548.745 564.813 554.955 558.426L572.846 540.028L547.491 536.069C477.353 525.119 415.827 521.165 370.17 524.784C347.422 526.587 327.802 530.327 312.825 536.518C298.13 542.593 285.26 552.199 281.225 567.258C278.459 577.582 280.619 587.87 285.28 597.197C289.891 606.426 297.288 615.461 306.464 624.207C324.826 641.71 352.376 659.988 386.445 678.103C454.775 714.436 552.003 751.508 661.996 780.981C771.989 810.453 874.727 826.961 952.069 829.662C990.631 831.008 1023.63 828.954 1048.28 822.977C1060.6 819.99 1071.53 815.864 1080.13 810.178C1088.83 804.431 1095.85 796.601 1098.61 786.277C1102.57 771.503 1096.54 757.018 1087.19 744.606C1077.68 731.984 1063.11 719.192 1044.99 706.521C1008.62 681.09 955.273 654.298 891.197 629.089L867.284 619.682L873.462 644.625C874.728 649.737 875.782 654.908 876.619 660.126C877.198 663.74 877.671 667.366 878.039 670.999L878.842 678.94L886.234 681.95C917.603 694.728 945.614 707.698 969.488 720.393C1001.77 737.56 1024.71 753.291 1038.24 766.186C1040.3 768.146 1042 769.914 1043.41 771.484C1041.4 772.142 1039.04 772.821 1036.28 773.49C1018.12 777.894 990.39 780.048 953.846 778.772C881.379 776.242 782.582 760.575 675.175 731.795C567.768 703.016 474.374 667.185 410.351 633.143C378.065 615.976 355.126 600.245 341.598 587.349C339.542 585.39 337.838 583.622 336.433 582.051C338.435 581.394 340.795 580.715 343.555 580.046C361.718 575.642 389.449 573.488 425.994 574.764C455.096 575.78 488.508 578.918 525.096 584.196L533.007 585.337ZM324.575 588.612C326.641 591.106 329.233 593.892 332.444 596.952C347.232 611.048 371.373 627.443 404.122 644.857C469.268 679.496 563.661 715.65 671.741 744.61C779.822 773.57 879.646 789.456 953.383 792.031C990.452 793.325 1019.56 791.197 1039.41 786.383C1043.72 785.338 1047.36 784.222 1050.4 783.094C1050.6 783.019 1050.8 782.943 1051 782.867C1054.66 781.469 1057.41 780.062 1059.38 778.76C1060.43 778.067 1061.13 777.494 1061.59 777.059C1061.66 776.999 1061.72 776.942 1061.77 776.888C1061.79 776.867 1061.81 776.846 1061.83 776.826C1061.95 776.703 1062.05 776.594 1062.13 776.501C1062.11 776.381 1062.08 776.238 1062.03 776.071C1062.03 776.044 1062.02 776.016 1062.01 775.987C1061.99 775.913 1061.97 775.834 1061.94 775.75C1061.76 775.142 1061.44 774.294 1060.88 773.17C1059.82 771.057 1058.15 768.465 1055.67 765.424C1055.54 765.258 1055.4 765.092 1055.26 764.924C1053.2 762.43 1050.61 759.644 1047.4 756.584C1032.61 742.487 1008.47 726.092 975.717 708.679C951.371 695.734 922.941 682.577 891.238 669.664C890.845 665.775 890.338 661.894 889.718 658.026C889.662 657.679 889.606 657.332 889.548 656.986C888.682 651.754 887.611 646.567 886.34 641.435C891.392 643.423 896.372 645.418 901.278 647.421C1019.89 695.838 1095.07 748.249 1085.8 782.844C1072.27 833.321 884.068 826.75 665.43 768.166C446.791 709.582 280.514 621.17 294.04 570.692C303.503 535.376 398.47 527.985 529.542 546.794C534.786 547.546 540.088 548.341 545.444 549.177C541.759 552.967 538.221 556.903 534.839 560.978C532.12 564.252 529.503 567.616 526.99 571.065C490.029 565.733 456.13 562.541 426.456 561.505C389.388 560.211 360.284 562.339 340.429 567.152C336.118 568.197 332.481 569.314 329.445 570.441C329.24 570.517 329.038 570.593 328.839 570.669C325.178 572.066 322.431 573.474 320.46 574.776C319.416 575.466 318.714 576.038 318.251 576.472C318.186 576.533 318.125 576.592 318.069 576.648C318.048 576.669 318.028 576.689 318.008 576.709M317.662 576.554C317.663 576.549 317.664 576.546 317.665 576.547C317.669 576.548 317.671 576.591 317.662 576.671C317.659 576.608 317.66 576.569 317.662 576.554ZM317.827 577.549C317.82 577.52 317.812 577.492 317.805 577.465C317.762 577.297 317.731 577.154 317.709 577.034M327.358 585.217L327.557 585.386C327.541 585.405 327.524 585.424 327.507 585.443L327.358 585.217ZM324.165 588.112C324.3 588.277 324.436 588.444 324.575 588.612L324.165 588.112ZM1062.18 776.981C1062.18 776.987 1062.18 776.989 1062.17 776.989C1062.17 776.988 1062.17 776.945 1062.18 776.864C1062.18 776.927 1062.18 776.966 1062.18 776.981C1062.18 776.981 1062.18 776.981 1062.18 776.981ZM317.427 577.435C317.426 577.434 317.427 577.432 317.429 577.426C317.435 577.412 317.452 577.378 317.487 577.325C317.454 577.4 317.431 577.435 317.427 577.435ZM324.165 588.112C321.693 585.071 320.018 582.479 318.962 580.366C318.399 579.239 318.077 578.389 317.894 577.781C317.869 577.699 317.847 577.622 317.827 577.549M327.358 585.217L327.507 585.443L327.358 585.217ZM325.714 582.729L328.324 584.443L325.714 582.729ZM1062.41 776.101C1062.41 776.1 1062.38 776.136 1062.35 776.21L1062.41 776.101ZM1062.35 776.21C1062.39 776.157 1062.41 776.123 1062.41 776.109L1062.35 776.21Z" fill="#855DCD"/>
      <defs>
      <linearGradient id="paint0_linear_1_140" x1="671.933" y1="754.714" x2="421.748" y2="1572.89" gradientUnits="userSpaceOnUse">
      <stop stop-color="#855DCD"/>
      <stop offset="1" stop-color="#855DCD" stop-opacity="0"/>
      </linearGradient>
      </defs>
      </svg>
      `;

    if (!clientId || !neynarLoginUrl) {
      console.error("Neynar Signin: Missing required data attributes");
      return;
    }

    // Check if the button already exists
    var existingButton = element.querySelector("button");
    if (existingButton) {
      return; // If button exists, do not create a new one
    }

    var button = document.createElement("button");

    button.style.height = height ?? "48px";
    button.style.width = width;
    button.style.minWidth = "205px";
    button.style.borderRadius = borderRadius ?? "5px";
    button.style.fontSize = fontSize ?? "16px";
    button.style.fontWeight = fontWeight ?? "normal";
    button.style.padding = padding ?? "8px 15px";
    button.style.margin = margin ?? "0px";
    button.style.color = color
      ? color
      : theme === "dark"
      ? "#ffffff"
      : "#000000";
    button.style.backgroundColor = backgroundColor
      ? backgroundColor
      : theme === "dark"
      ? "#000000"
      : "#ffffff";
    button.style.display = "inline-flex";
    button.style.alignItems = "center";
    button.style.justifyContent = "center";
    button.style.columnGap = "10px";

    if (styles) {
      try {
        var _styles = JSON.parse(styles);
        Object.assign(button.style, _styles);
      } catch (e) {
        console.error("Invalid JSON for data-styles:", styles);
      }
    }

    if ((!variant && !text) || variant === "neynar") {
      button.innerHTML = `
          <span>${neynarLogo}</span>
          <span>Sign in with Neynar</span>
        `;
    } else if (variant === "warpcast") {
      button.innerHTML = `
          <span>${warpcastLogo}</span>
          <span>Connect Warpcast</span>
        `;
    } else if (variant === "farcaster") {
      button.innerHTML = `
          <span>${farcasterLogo}</span>
          <span>Connect Farcaster</span>
        `;
    } else {
      button.innerHTML = `
          ${
            customLogoUrl
              ? `<span>${getLogo(customLogoUrl, button, text)}</span>`
              : `<span>${text}</span>`
          }
        `;
    }

    button.onclick = function () {
      handleSignIn(neynarLoginUrl, clientId, redirectUri, successCallback);
    };

    button.style.cursor = "pointer";

    element.appendChild(button);
  }

  function init() {
    var signinElements = document.querySelectorAll(".neynar_signin");
    signinElements.forEach(createSignInButton);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
