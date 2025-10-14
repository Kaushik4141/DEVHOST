import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import time

BASE_URL = "https://www.motia.dev/docs"
visited = set()
output_file = "motia_docs.txt"

def scrape_page(url):
    """Scrape a single documentation page."""
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")
        content = []

        
        for tag in soup.find_all(["h1", "h2", "h3", "p", "pre", "code", "li"]):
            text = tag.get_text(strip=True)
            if text:
                content.append(text)

        return "\n".join(content)
    except Exception as e:
        print(f" Failed to scrape {url}: {e}")
        return ""

def crawl_docs(url):
    """Recursively crawl all pages under the docs base URL."""
    if url in visited or not url.startswith(BASE_URL):
        return
    visited.add(url)

    print(f" Scraping: {url}")
    page_text = scrape_page(url)

   
    with open(output_file, "a", encoding="utf-8") as f:
        f.write(f"\n\n===== {url} =====\n\n")
        f.write(page_text)
        f.write("\n\n")

    soup = BeautifulSoup(requests.get(url).text, "html.parser")
    for link in soup.find_all("a", href=True):
        full_link = urljoin(url, link["href"])
        if full_link.startswith(BASE_URL):
            crawl_docs(full_link)
        time.sleep(0.5) 


print("Starting full documentation scrape...")
crawl_docs(BASE_URL)
print(f"\n Done! Full documentation saved to {output_file}")