const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

async function build() {
  const distDir = path.join(__dirname, 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Build readable bundle
  await esbuild.build({
    entryPoints: ['src/index.js'],
    bundle: true,
    outfile: 'dist/widget.js',
    format: 'iife',
    target: ['es2020'],
  });

  // Build minified bundle
  await esbuild.build({
    entryPoints: ['src/index.js'],
    bundle: true,
    minify: true,
    outfile: 'dist/widget.min.js',
    format: 'iife',
    target: ['es2020'],
  });

  // Also copy dist/widget.js to project root widget.js
  fs.copyFileSync(
    path.join(__dirname, 'dist', 'widget.js'),
    path.join(__dirname, '..', 'widget.js')
  );

  const backendDir = path.join(__dirname, '..', 'backend');
  if (fs.existsSync(backendDir)) {
    const backendStaticDir = path.join(backendDir, 'static');
    if (!fs.existsSync(backendStaticDir)) {
      fs.mkdirSync(backendStaticDir, { recursive: true });
    }
    fs.copyFileSync(
      path.join(__dirname, 'dist', 'widget.js'),
      path.join(backendStaticDir, 'widget.js')
    );
    fs.copyFileSync(
      path.join(__dirname, 'dist', 'widget.min.js'),
      path.join(backendStaticDir, 'widget.min.js')
    );
    fs.copyFileSync(
      path.join(__dirname, 'demo.html'),
      path.join(backendStaticDir, 'demo.html')
    );
    console.log('✅ Copied static files to backend/static/ for production deployment!');
  }

  console.log('✅ Xur Widget built successfully in dist/widget.js and dist/widget.min.js!');
}

build().catch((err) => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
