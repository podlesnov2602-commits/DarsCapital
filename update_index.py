import re

filepath = "frontend/public/index.html"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Add Google Fonts link for Playfair Display and Montserrat
fonts_link = """
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
"""

content = content.replace("<head>", f"<head>\n{fonts_link}")

# Add class to body to use montserrat as default
content = content.replace("<body>", '<body class="font-sans text-foreground bg-background antialiased selection:bg-gold selection:text-white">')

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
