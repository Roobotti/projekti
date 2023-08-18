import { createContext, useEffect, useState } from "react";

import * as Font from "expo-font";

export const AssetsContext = createContext();

export const AssetsContextProvider = ({ children }) => {
  const [assetsLoading, setLoading] = useState(true);
  const [fontsLoading, setFontsLoading] = useState(true);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [paint_1, set1] = useState(null);
  const [paint_3, set3] = useState(null);
  const [paint_delete, setDelete] = useState(null);
  const [paint_loses, setLoses] = useState(null);
  const [paint_profile, setProfile] = useState(null);
  const [paint_wins, setWins] = useState(null);
  const [paint_X, setX] = useState(null);
  const [greenEffect, set_greenEffect] = useState(null);
  const [redEffect, set_redEffect] = useState(null);
  const [caveWall, set_caveWall] = useState(null);
  const [blockImageMapping, setBlockImageMapping] = useState(null);

  useEffect(() => {
    if (!fontsLoading && !imagesLoading) setLoading(false);
  }, [fontsLoading, imagesLoading]);

  //fonts
  useEffect(() => {
    const load = async () => {
      setFontsLoading(true);
      await Font.loadAsync({
        FreckleFace: require("../../assets/fonts/FreckleFace-Regular.ttf"),
      });
      await Font.loadAsync({
        Kablammo: require("../../assets/fonts/Kablammo-Regular.ttf"),
      });
      await Font.loadAsync({
        Flavors: require("../../assets/fonts/Flavors-Regular.ttf"),
      });
      setFontsLoading(false);
    };
    load();
  }, []);

  //images
  useEffect(() => {
    const loadImages = async () => {
      try {
        console.log("loading");
        const [
          img1,
          img3,
          imgDelete,
          imgLoses,
          imgProfile,
          imgWins,
          imgX,
          imgGreenEffect,
          imgRedEffect,
          imgCaveWall,
        ] = await Promise.all([
          require("../../assets/paints/paint_1.png"),
          require("../../assets/paints/paint_3.png"),
          require("../../assets/paints/paint_delete.png"),
          require("../../assets/paints/paint_loses.png"),
          require("../../assets/paints/paint_profile.png"),
          require("../../assets/paints/paint_wins.png"),
          require("../../assets/paints/paint_X.png"),

          require("../../assets/backGround/greenEffect.png"),
          require("../../assets/backGround/redEffect.png"),
          require("../../assets/backGround/caveWall.png"),
        ]);

        set1(img1);
        set3(img3);
        setDelete(imgDelete);
        setLoses(imgLoses);
        setProfile(imgProfile);
        setWins(imgWins);
        setX(imgX);
        set_greenEffect(imgGreenEffect);
        set_redEffect(imgRedEffect);
        set_caveWall(imgCaveWall);

        const [
          g1_block,
          g2_block,
          g3_block,
          g4_block,
          b1_block,
          b2_block,
          b3_block,
          b4_block,
          r1_block,
          r2_block,
          r3_block,
          r4_block,
          y1_block,
          y2_block,
          y3_block,
          y4_block,
        ] = await Promise.all([
          require("../../assets/block_images/g1.png"),
          require("../../assets/block_images/g2.png"),
          require("../../assets/block_images/g3.png"),
          require("../../assets/block_images/g4.png"),
          require("../../assets/block_images/b1.png"),
          require("../../assets/block_images/b2.png"),
          require("../../assets/block_images/b3.png"),
          require("../../assets/block_images/b4.png"),
          require("../../assets/block_images/r1.png"),
          require("../../assets/block_images/r2.png"),
          require("../../assets/block_images/r3.png"),
          require("../../assets/block_images/r4.png"),
          require("../../assets/block_images/y1.png"),
          require("../../assets/block_images/y2.png"),
          require("../../assets/block_images/y3.png"),
          require("../../assets/block_images/y4.png"),
        ]);
        setBlockImageMapping({
          g1: g1_block,
          g2: g2_block,
          g3: g3_block,
          g4: g4_block,
          b1: b1_block,
          b2: b2_block,
          b3: b3_block,
          b4: b4_block,
          r1: r1_block,
          r2: r2_block,
          r3: r3_block,
          r4: r4_block,
          y1: y1_block,
          y2: y2_block,
          y3: y3_block,
          y4: y4_block,
        });
        console.log("loaded");
        setImagesLoading(false);
      } catch (error) {
        console.error("Error loading images:", error);
        setImagesLoading(false);
      }
    };
    loadImages();
  }, []);

  return (
    <AssetsContext.Provider
      value={{
        assetsLoading,
        paint_1,
        paint_3,
        paint_delete,
        paint_loses,
        paint_profile,
        paint_wins,
        paint_X,
        caveWall,
        redEffect,
        greenEffect,
        blockImageMapping,
      }}
    >
      {children}
    </AssetsContext.Provider>
  );
};
