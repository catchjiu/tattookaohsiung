-- Add show_in_hero_slider to portfolio_images for hero slider selection
ALTER TABLE "portfolio_images" ADD COLUMN "show_in_hero_slider" BOOLEAN NOT NULL DEFAULT false;
