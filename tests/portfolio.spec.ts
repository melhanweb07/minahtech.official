import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

async function completeForm(page: Page) {
  await page.getByLabel("Full Name").fill("Browser Test");
  await page.getByLabel("Business / Company").fill("Test Fixture Only");
  await page.getByLabel("Email Address").fill("test@example.com");
  await page.getByLabel("Phone Number").fill("+91 9600159063");
  await page.getByLabel("Service Required").selectOption("Website Development");
  await page
    .getByLabel("Project Description")
    .fill(
      "This is an automated browser test enquiry. It must not be delivered.",
    );
}

async function revealPage(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 650) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((resolve) => setTimeout(resolve, 45));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  });
  await page.waitForTimeout(150);
}

test("shows the supplied projects and filters the work", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Ideas Into Impact." }),
  ).toBeVisible();
  await expect(page.locator(".project-card")).toHaveCount(8);
  await page.getByRole("button", { name: "Websites", exact: true }).click();
  await expect(page.locator(".project-card")).toHaveCount(4);
  await expect(
    page.getByRole("button", { name: "Websites", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page
    .getByRole("button", { name: "Web Applications", exact: true })
    .click();
  await expect(page.locator(".project-card")).toHaveCount(3);
  await expect(page.locator(".project-card").filter({
    hasText: "Sahara Enterprises Billing System",
  })).toHaveCount(1);
  await expect(page.locator(".project-card").filter({
    hasText: "Nadeem Beef Center",
  })).toHaveCount(1);
  await expect(page.locator(".project-card").filter({
    hasText: "PressPilot",
  })).toHaveCount(1);
  await page.getByRole("button", { name: "E-commerce", exact: true }).click();
  await expect(page.locator(".project-card")).toHaveCount(1);
  await expect(page.locator(".project-card")).toContainText(
    "Swag Shopping Mall",
  );
  await page.getByRole("button", { name: /All Work/ }).click();
  await expect(page.locator(".project-card")).toHaveCount(8);
  expect(errors).toEqual([]);
});

test("project dialogs are keyboard accessible and identify illustrative imagery", async ({
  page,
}) => {
  await page.goto("/");
  const opener = page.getByRole("button", {
    name: "View Al-Wafa Interiors project details",
  });
  await opener.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText(
    "This photograph is an illustrative cover",
  );
  await expect(dialog).toContainText(
    "A public website link has not been supplied",
  );
  await expect(
    page.getByRole("button", { name: "Close dialog" }),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(
    dialog.getByRole("link", { name: "Discuss a similar project" }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Close dialog" }),
  ).toBeFocused();
  const scan = await new AxeBuilder({ page }).withTags(tags).analyze();
  expect(scan.violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(opener).toBeFocused();
  const liveProjectUrl = "https://swag-shopping-mall.vercel.app/";
  await page.route(liveProjectUrl, (route) =>
    route.fulfill({ status: 200, contentType: "text/html", body: "Live site" }),
  );
  const liveProjectOpener = page.getByRole("link", {
    name: "Open Swag Shopping Mall website in a new tab",
  });
  await expect(liveProjectOpener).toHaveAttribute("href", liveProjectUrl);
  const popupPromise = page.waitForEvent("popup");
  await liveProjectOpener.click();
  const popup = await popupPromise;
  await expect(popup).toHaveURL(liveProjectUrl);
  await popup.close();
  await expect(page.locator("#root")).not.toHaveAttribute("inert", "");
});

test("navigation, service details, and contact links work", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Services" })
    .click();
  await expect(page).toHaveURL(/#services$/);
  const service = page
    .locator(".service-item")
    .filter({ has: page.getByRole("heading", { name: "UI/UX Design" }) });
  await service
    .getByRole("button", { name: "UI/UX Design", exact: true })
    .click();
  await expect(service).toContainText("Interactive prototypes");
  await service.getByRole("link", { name: "Let's talk about it" }).click();
  await expect(page).toHaveURL(/#contact$/);
  await expect(page.locator(".contact-form-wrap")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "minahtech26@gmail.com" })).toBeVisible();
  await expect(page.getByRole("link", { name: "+91 9600159063" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "MINAH TECH social media" }).getByRole("link")).toHaveCount(4);
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Testimonials" })
    .click();
  await expect(
    page
      .getByRole("region", { name: "Trusted by Businesses" })
      .getByText("Nadeem Beef Center", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Back to top of selected work", exact: true })
    .click();
  await expect(page).toHaveURL(/#projects$/);
  await expect(page.locator(".desktop-nav a").first()).toHaveAttribute(
    "aria-current",
    "location",
  );
});

test.skip("required fields, phone, and email are validated with an honest mailto fallback", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  const submissions: string[] = [];
  page.on("request", (request) => {
    if (request.method() === "POST") submissions.push(request.url());
  });
  await page.goto("/#contact");
  await page
    .getByRole("button", { name: "Let's Discuss Your Project" })
    .click();
  await expect(page.locator(".field-error")).toHaveCount(5);
  await expect(page.getByLabel("Full Name")).toBeFocused();
  await completeForm(page);
  await page.getByLabel("Email Address").fill("invalid-email");
  await page.getByLabel("Phone Number").fill("abc");
  await page
    .getByRole("button", { name: "Let's Discuss Your Project" })
    .click();
  await expect(page.locator(".field-error")).toHaveCount(2);
  await expect(page.getByLabel("Email Address")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await completeForm(page);
  await page
    .getByRole("button", { name: "Let's Discuss Your Project" })
    .click();
  await expect(page.getByText("Your email draft is ready.")).toBeVisible();
  await expect(page.getByText(/No enquiry has been sent yet/)).toBeVisible();
  const href = await page
    .getByRole("link", { name: "Open email app" })
    .getAttribute("href");
  expect(decodeURIComponent(href || "")).toContain("test@example.com");
  expect(href).toContain("mailto:minahtech26@gmail.com");
  await page.getByRole("button", { name: "Copy project details" }).click();
  await expect(page.getByText(/Project details copied/)).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    "Browser Test",
  );
  expect(submissions).toEqual([]);
});

test.skip("configured form service shows loading, preserves failures, and confirms accepted enquiries", async ({
  page,
}) => {
  await page.route("**/src/data/company.js*", async (route) => {
    const response = await route.fetch();
    const body = (await response.text()).replace(
      /formEndpoint:\s*['"]['"]/,
      "formEndpoint: 'https://formspree.io/f/browser-test-only'",
    );
    await route.fulfill({ response, body });
  });
  let attempts = 0;
  await page.route(
    "https://formspree.io/f/browser-test-only",
    async (route) => {
      attempts += 1;
      expect(route.request().method()).toBe("POST");
      expect(route.request().postData()).toContain("test@example.com");
      await new Promise((resolve) => setTimeout(resolve, 400));
      await route.fulfill({
        status: attempts === 1 ? 422 : 200,
        contentType: "application/json",
        body: attempts === 1 ? '{"error":"test failure"}' : '{"ok":true}',
      });
    },
  );
  await page.goto("/#contact");
  await completeForm(page);
  await page
    .getByRole("button", { name: "Let's Discuss Your Project" })
    .click();
  await expect(
    page.getByRole("button", { name: "Sending your enquiry..." }),
  ).toBeDisabled();
  await expect(page.getByText("Your enquiry has not been sent.")).toBeVisible();
  await expect(page.getByLabel("Full Name")).toHaveValue("Browser Test");
  await page
    .getByRole("button", { name: "Let's Discuss Your Project" })
    .click();
  await expect(
    page.getByText("Your enquiry was accepted by our form service.", {
      exact: false,
    }),
  ).toBeVisible();
  await expect(page.getByLabel("Full Name")).toHaveValue("");
  expect(attempts).toBe(2);
});

test("genuine-review carousel infrastructure and on-demand videos work with test-only fixtures", async ({
  page,
}) => {
  const fixtures = [
    {
      id: "test-mp4",
      name: "Test Fixture One",
      company: "Not Published",
      review:
        "Synthetic fixture used only to verify the video player in automated tests.",
      approved: true,
      video: {
        type: "mp4",
        url: "https://example.com/browser-test.mp4",
        thumbnail: "/images/interiors.webp",
      },
    },
    {
      id: "test-youtube",
      name: "Test Fixture Two",
      company: "Not Published",
      review:
        "Synthetic fixture used only to verify carousel navigation in automated tests.",
      approved: true,
      video: {
        type: "youtube",
        url: "https://www.youtube.com/watch?v=abcdefghijk",
        thumbnail: "/images/education.webp",
      },
    },
    {
      id: "unapproved",
      name: "Unapproved Fixture",
      company: "Hidden",
      review: "This fixture must not be visible.",
      approved: false,
    },
  ];
  await page.route("**/src/data/testimonials.js*", (route) =>
    route.fulfill({
      contentType: "application/javascript",
      body: `export const testimonials = ${JSON.stringify(fixtures)};`,
    }),
  );
  let videoRequests = 0;
  await page.route("https://example.com/browser-test.mp4", (route) => {
    videoRequests += 1;
    return route.fulfill({ status: 404 });
  });
  await page.route("https://www.youtube-nocookie.com/**", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<html><body>Test-only embedded player</body></html>",
    }),
  );
  await page.goto("/#testimonials");
  await expect(
    page.getByText("Test Fixture One", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Unapproved Fixture")).toHaveCount(0);
  expect(videoRequests).toBe(0);
  await page
    .getByRole("button", {
      name: "In their own words: watch the testimonial from Test Fixture One",
    })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByText("This video cannot be played here."),
  ).toBeVisible();
  expect(videoRequests).toBeGreaterThan(0);
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Next testimonial" }).click();
  await expect(
    page.getByText("Test Fixture Two", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", {
      name: "In their own words: watch the testimonial from Test Fixture Two",
    })
    .click();
  await expect(page.locator(".video-player iframe")).toHaveAttribute(
    "src",
    "https://www.youtube-nocookie.com/embed/abcdefghijk?autoplay=1&rel=0",
  );
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Previous testimonial" }).click();
  await expect(
    page.getByText("Test Fixture One", { exact: true }),
  ).toBeVisible();
});

test("mobile menu, responsive layouts, and direct contact links work", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeVisible();
  const menuScan = await new AxeBuilder({ page }).withTags(tags).analyze();
  expect(menuScan.violations).toEqual([]);
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Start a Project" })
    .click();
  await expect(page).toHaveURL(/#contact$/);
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toHaveCount(0);
  const whatsapp = page.getByRole("link", { name: /Let's Talk on WhatsApp/ });
  await expect(whatsapp).toHaveAttribute(
    "href",
    "https://wa.me/919600159063?text=Hello%20MINAH%20TECH%2C%20I%20am%20interested%20in%20your%20services.",
  );
  await expect(page.locator(".contact-information a").nth(0)).toHaveAttribute(
    "href",
    "mailto:minahtech26@gmail.com",
  );
  await expect(page.locator(".contact-information a").nth(1)).toHaveAttribute(
    "href",
    "tel:+919600159063",
  );
  for (const width of [320, 375, 390, 540, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await expect
      .poll(
        () =>
          page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        { message: `No overflow at ${width}px` },
      )
      .toBe(true);
  }
  const socialProfiles = [
    [
      "Instagram",
      "https://www.instagram.com/minahtech.official?dmpr=MWFpMXYybHpoc3dmeA==",
    ],
    ["LinkedIn", "https://www.linkedin.com/company/minah-tech/"],
    ["YouTube", "https://youtube.com/@minah-tech?si=THcY70LoinG7ILnL"],
    ["Facebook", "https://www.facebook.com/share/1Mg8RcpeRi/"],
  ];
  for (const [name, url] of socialProfiles) {
    const profileLink = page.getByRole("link", { name, exact: true });
    await expect(profileLink).toHaveAttribute("href", url);
    await expect(profileLink.locator("svg.social-mark")).toHaveCount(1);
  }
  await expect(page.locator(".social-unavailable")).toContainText("GitHub");
  await expect(
    page.locator(".social-unavailable svg.social-mark"),
  ).toHaveCount(1);
});

test("page has no detectable WCAG A/AA violations and all local images load", async ({
  page,
}) => {
  await page.goto("/");
  await revealPage(page);
  await page.waitForLoadState("networkidle");
  const scan = await new AxeBuilder({ page }).analyze();
  expect(scan.violations).toEqual([]);
  const images = await page.locator("img").evaluateAll((elements) =>
    elements.map((image) => ({
      src: image.getAttribute("src"),
      loaded: image.complete && image.naturalWidth > 0,
    })),
  );
  expect(
    images.every((image) => image.loaded),
    JSON.stringify(images),
  ).toBe(true);
  await expect(page).toHaveTitle(
    "MINAH TECH | Software Development & Digital Solutions",
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    "https://minah-tech.web.app/og-image.png",
  );
});
