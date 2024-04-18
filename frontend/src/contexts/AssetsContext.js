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
  const [blockImageVariationsMapping, setBlockImageVariationsMapping] =
    useState(null);

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

        const [
          g1_blocks,
          g2_blocks,
          g3_blocks,
          g4_blocks,
          b1_blocks,
          b2_blocks,
          b3_blocks,
          b4_blocks,
          r1_blocks,
          r2_blocks,
          r3_blocks,
          r4_blocks,
          y1_blocks,
          y2_blocks,
          y3_blocks,
          y4_blocks,
        ] = await Promise.all([
          [
            require("../../assets/block_color_variations/g1/blue.png"),
            require("../../assets/block_color_variations/g1/green.png"),
            require("../../assets/block_color_variations/g1/red.png"),
            require("../../assets/block_color_variations/g1/yellow.png"),
          ],
          [
            require("../../assets/block_color_variations/g2/blue.png"),
            require("../../assets/block_color_variations/g2/green.png"),
            require("../../assets/block_color_variations/g2/red.png"),
            require("../../assets/block_color_variations/g2/yellow.png"),
          ],
          [
            require("../../assets/block_color_variations/g3/blue.png"),
            require("../../assets/block_color_variations/g3/green.png"),
            require("../../assets/block_color_variations/g3/red.png"),
            require("../../assets/block_color_variations/g3/yellow.png"),
          ],
          [
            require("../../assets/block_color_variations/g4/blue.png"),
            require("../../assets/block_color_variations/g4/green.png"),
            require("../../assets/block_color_variations/g4/red.png"),
            require("../../assets/block_color_variations/g4/yellow.png"),
          ],
          [
            require("../../assets/block_color_variations/b1/blue.png"),
            require("../../assets/block_color_variations/b1/green.png"),
            require("../../assets/block_color_variations/b1/red.png"),
            require("../../assets/block_color_variations/b1/yellow.png"),
          ],
          [
            require("../../assets/block_color_variations/b2/blue.png"),
            require("../../assets/block_color_variations/b2/green.png"),
            require("../../assets/block_color_variations/b2/red.png"),
            require("../../assets/block_color_variations/b2/yellow.png"),
          ],
          [
            require("../../assets/block_color_variations/b3/blue.png"),
            require("../../assets/block_color_variations/b3/green.png"),
            require("../../assets/block_color_variations/b3/red.png"),
            require("../../assets/block_color_variations/b3/yellow.png"),
          ],
          [
            require("../../assets/block_color_variations/b4/blue.png"),
            require("../../assets/block_color_variations/b4/green.png"),
            require("../../assets/block_color_variations/b4/red.png"),
            require("../../assets/block_color_variations/b4/yellow.png"),
          ],
          [
            require("../../assets/block_color_variations/r1/blue.png"),
            require("../../assets/block_color_variations/r1/green.png"),
            require("../../assets/block_color_variations/r1/red.png"),
            require("../../assets/block_color_variations/r1/yellow.png"),
          ],
          [
            require("../../assets/block_color_variations/r2/blue.png"),
            require("../../assets/block_color_variations/r2/green.png"),
            require("../../assets/block_color_variations/r2/red.png"),
            require("../../assets/block_color_variations/r2/yellow.png"),
          ],
          [
            require("../../assets/block_color_variations/r3/blue.png"),
            require("../../assets/block_color_variations/r3/green.png"),
            require("../../assets/block_color_variations/r3/red.png"),
            require("../../assets/block_color_variations/r3/yellow.png"),
          ],
          [
            require("../../assets/block_color_variations/r4/blue.png"),
            require("../../assets/block_color_variations/r4/green.png"),
            require("../../assets/block_color_variations/r4/red.png"),
            require("../../assets/block_color_variations/r4/yellow.png"),
          ],
          [
            require("../../assets/block_color_variations/y1/blue.png"),
            require("../../assets/block_color_variations/y1/green.png"),
            require("../../assets/block_color_variations/y1/red.png"),
            require("../../assets/block_color_variations/y1/yellow.png"),
          ],
          [
            require("../../assets/block_color_variations/y2/blue.png"),
            require("../../assets/block_color_variations/y2/green.png"),
            require("../../assets/block_color_variations/y2/red.png"),
            require("../../assets/block_color_variations/y2/yellow.png"),
          ],
          [
            require("../../assets/block_color_variations/y3/blue.png"),
            require("../../assets/block_color_variations/y3/green.png"),
            require("../../assets/block_color_variations/y3/red.png"),
            require("../../assets/block_color_variations/y3/yellow.png"),
          ],
          [
            require("../../assets/block_color_variations/y4/blue.png"),
            require("../../assets/block_color_variations/y4/green.png"),
            require("../../assets/block_color_variations/y4/red.png"),
            require("../../assets/block_color_variations/y4/yellow.png"),
          ],
        ]);
        setBlockImageVariationsMapping({
          g1: {
            blue: g1_blocks[0],
            green: g1_blocks[1],
            red: g1_blocks[2],
            yellow: g1_blocks[3],
          },
          g2: {
            blue: g2_blocks[0],
            green: g2_blocks[1],
            red: g2_blocks[2],
            yellow: g2_blocks[3],
          },
          g3: {
            blue: g3_blocks[0],
            green: g3_blocks[1],
            red: g3_blocks[2],
            yellow: g3_blocks[3],
          },
          g4: {
            blue: g4_blocks[0],
            green: g4_blocks[1],
            red: g4_blocks[2],
            yellow: g4_blocks[3],
          },
          b1: {
            blue: b1_blocks[0],
            green: b1_blocks[1],
            red: b1_blocks[2],
            yellow: b1_blocks[3],
          },
          b2: {
            blue: b2_blocks[0],
            green: b2_blocks[1],
            red: b2_blocks[2],
            yellow: b2_blocks[3],
          },
          b3: {
            blue: b3_blocks[0],
            green: b3_blocks[1],
            red: b3_blocks[2],
            yellow: b3_blocks[3],
          },
          b4: {
            blue: b4_blocks[0],
            green: b4_blocks[1],
            red: b4_blocks[2],
            yellow: b4_blocks[3],
          },
          r1: {
            blue: r1_blocks[0],
            green: r1_blocks[1],
            red: r1_blocks[2],
            yellow: r1_blocks[3],
          },
          r2: {
            blue: r2_blocks[0],
            green: r2_blocks[1],
            red: r2_blocks[2],
            yellow: r2_blocks[3],
          },
          r3: {
            blue: r3_blocks[0],
            green: r3_blocks[1],
            red: r3_blocks[2],
            yellow: r3_blocks[3],
          },
          r4: {
            blue: r4_blocks[0],
            green: r4_blocks[1],
            red: r4_blocks[2],
            yellow: r4_blocks[3],
          },
          y1: {
            blue: y1_blocks[0],
            green: y1_blocks[1],
            red: y1_blocks[2],
            yellow: y1_blocks[3],
          },
          y2: {
            blue: y2_blocks[0],
            green: y2_blocks[1],
            red: y2_blocks[2],
            yellow: y2_blocks[3],
          },
          y3: {
            blue: y3_blocks[0],
            green: y3_blocks[1],
            red: y3_blocks[2],
            yellow: y3_blocks[3],
          },
          y4: {
            blue: y4_blocks[0],
            green: y4_blocks[1],
            red: y4_blocks[2],
            yellow: y4_blocks[3],
          },
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
        fontsLoading,
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
        blockImageVariationsMapping,
      }}
    >
      {children}
    </AssetsContext.Provider>
  );
};
