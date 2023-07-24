import numpy as np
from numpy import array
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
from itertools import permutations
import itertools
from datetime import datetime
import random

from components import *

PUZZLE_HEIGHT = 2


def get_puzzle_dimensions(mytuple):
    """
    retrieves the dimensions (x,y) of the input pattern
    """
    dim_x = 0
    dim_y = 0
    for i, j in mytuple:
        dim_x = i if i > dim_x else dim_x
        dim_y = j if j > dim_y else dim_y
    return dim_x + 1, dim_y + 1


def get_piece_dimensions(mytuple):
    """
    retrieves the dimensions (x,y,z) of the input piece
    """
    dim_x = 0
    dim_y = 0
    dim_z = 0
    for i, j, k in mytuple:
        dim_x = i if i > dim_x else dim_x
        dim_y = j if j > dim_y else dim_y
        dim_z = k if k > dim_z else dim_z

    return dim_x + 1, dim_y + 1, dim_z + 1


def generate_basic_puzzle(pattern, height):
    """
    generates basic ubongo puzzle
    by populating a 3d binary matrix from the input pattern,
    stacked "height" times
    """
    # generate base, populate from list of indices
    base = np.zeros((4, 4))
    for i, j in pattern:
        base[i, j] = 1

    # stack
    base_d3 = array([base] * height)
    return base_d3


def generate_piece(coordinates):
    """
    generates basic ubongo piece
    by populating a 3d matrix from the input coordinates
    """
    piece = np.zeros(shape=(get_piece_dimensions(coordinates)))
    for i, j, k in coordinates:
        piece[i, j, k] = 1
    return piece


def generate_block(coordinates):
    """
    Generates a block by populating a 3D matrix from the input coordinates.
    """
    max_coords = np.max(coordinates, axis=0)
    block = np.zeros(shape=(3, 3, 3))
    print(block)
    print("---------")
    for i, j, k in coordinates:
        block[i, j, k] = 1
    return block


def generate_base(coordinates):
    """
    Generates a block by populating a 3D matrix from the input coordinates.
    """
    max_coords = np.max(coordinates, axis=0)
    base = np.zeros(shape=(max_coords[0] + 1, max_coords[1] + 1))

    for i, j in coordinates:
        base[i, j] = 1

    return base.transpose()


def list_contains_item(mylist, myitem):
    """
    checks if a list of numpy arrays contains the given myitem array
    (can't unique because unhashable numpy arrays)
    """
    for i in range(len(mylist)):
        if np.array_equal(mylist[i], myitem):
            return True
    return False


def piece_variations(piece):
    """
    rotates the piece around all axes, returning all unique variations
    """
    variations = []

    for _x in range(4):
        piece = np.rot90(piece, axes=(0, 1))
        for _y in range(4):
            piece = np.rot90(piece, axes=(0, 2))
            for _z in range(4):  #
                piece = np.rot90(piece, axes=(1, 2))
                if not list_contains_item(variations, piece):
                    variations.append(piece)
    return variations


def piece_fits_puzzle(puzzle, pieces, piece_id):
    """
    checks if the list of rotated "piece" can still fit the puzzle
    """
    solutions = []
    piece_counter = 0
    verbose = False
    for piece in pieces:
        size_diff = [
            max(0, puzzle.shape[0] - piece.shape[0]) + 1,
            max(0, puzzle.shape[1] - piece.shape[1]) + 1,
            max(0, puzzle.shape[2] - piece.shape[2]) + 1,
        ]
        # piece still fits the available parts of the puzzle
        still_fits = True
        for shift_x in range(size_diff[0]):
            for shift_y in range(size_diff[1]):
                for shift_z in range(size_diff[2]):
                    still_fits = True
                    for i, j, k in np.ndindex(piece.shape):
                        if still_fits:
                            # if there is an empty part of the puzzle piece with these coordinates
                            if piece[i, j, k] == 1:
                                try:
                                    if (
                                        puzzle[i + shift_x, j + shift_y, k + shift_z]
                                        != 1
                                    ):
                                        still_fits = False
                                except:
                                    still_fits = False
                    if still_fits:
                        # found piece location, adding it to an instance of the puzzle
                        puzzle_instance = puzzle.copy()
                        for i, j, k in np.ndindex(piece.shape):
                            if piece[i, j, k] == 1:
                                puzzle_instance[
                                    i + shift_x, j + shift_y, k + shift_z
                                ] = piece_id
                        solutions.append(puzzle_instance)
    return solutions


def get_puzzle_size(puzzle):
    return (puzzle == 1).sum()


def solve_puzzle(puzzle, target_pieces, combos=5):
    """
    Takes a puzzle and a set of target pieces,
    returning all solutions with the solution count.
    """

    puzzle_size = get_puzzle_size(puzzle)
    piece_size = 0
    for piece in target_pieces:
        piece_size += piece_sizes[piece]

    if puzzle_size != piece_size:
        return 0, _

    i = 0

    partial_solutions = []
    target_count = len(target_pieces)

    # sort pieces so that larger one come first
    target_pieces.sort(key=lambda x: x[-1], reverse=True)

    for piece in target_pieces:
        if i == 0:
            partial_solutions.append(
                piece_fits_puzzle(
                    puzzle, rotated_pieces[piece], piece_color_codes[piece]
                )
            )
        else:
            if len(partial_solutions[i - 1]) > 0:
                _temp = []
                for partial_solution in partial_solutions[i - 1]:
                    _temp = _temp + piece_fits_puzzle(
                        partial_solution,
                        rotated_pieces[piece],
                        piece_color_codes[piece],
                    )
                partial_solutions.append(_temp)
        if partial_solutions[i]:
            i += 1
        else:
            break

    solution_count = 0

    if (i == target_count) & (len(partial_solutions[i - 1]) > 0):
        solution_count = len(partial_solutions[i - 1])
        return (solution_count, partial_solutions[i - 1])
    else:
        return (solution_count, _)


def color_pieces(solved_puzzle, value):
    """
    break down puzzle solution by each id
    """
    ret = solved_puzzle.copy()
    for i, j, k in np.ndindex(ret.shape):
        if ret[i, j, k] != value:
            ret[i, j, k] = 0
    return ret


def plot_solutions(target_pieces, puzzle_solution, solution_count):
    if solution_count:
        print(solution_count, "solution(s) found")
        for solution_id in range(solution_count):
            fig = plt.figure(figsize=(7, 7))
            ax = fig.add_subplot(111, projection="3d", aspect="auto")

            for piece in target_pieces:
                piece_position = color_pieces(
                    puzzle_solution[solution_id], piece_color_codes[piece]
                )
                ax.voxels(
                    piece_position.T,
                    facecolors=piece_colors[piece],
                    edgecolor="gray",
                )

            plt.axis("off")
            plt.axis("auto")

            plt.show()
    else:
        print("No solution")


def plot_combo(target_pieces):
    fig = plt.figure(figsize=(7, 7))
    i = 0
    for i, piece in enumerate(target_pieces):
        ax = fig.add_subplot(1, 4, i + 1, projection="3d")
        ax.axis("off")
        block = generate_block(piece_coordinates[piece])

        ax.set_xlim(0, block.shape[0])
        ax.set_ylim(0, block.shape[1])
        ax.set_zlim(0, block.shape[2])  # Set the maximum height for the plot

        ax.voxels(
            block,
            facecolors=piece_colors[piece],
            edgecolor="gray",
        )

    plt.axis("off")
    plt.show()


def find_good_combination(target_puzzle, combos=4):
    puzzle_size = get_puzzle_size(
        generate_basic_puzzle(puzzle_coordinates[target_puzzle], PUZZLE_HEIGHT)
    )

    for piece_count in range(1, 5):
        print("looking at combinations of ", piece_count, "pieces")
        piece_combinations = permutations(piece_coordinates.keys(), piece_count)
        piece_combinations = list(piece_combinations)
        random.shuffle(piece_combinations)

        for combination in piece_combinations:
            size = 0
            target_pieces = []
            for piece in enumerate(combination):
                size = size + piece_sizes[piece[1]]
                target_pieces.append(piece[1])

            if sorted(target_pieces) == target_pieces:
                if size == puzzle_size:
                    try:
                        solution_count, puzzle_solution = solve_puzzle(
                            generate_basic_puzzle(
                                puzzle_coordinates[target_puzzle], PUZZLE_HEIGHT
                            ),
                            target_pieces,
                        )
                        if solution_count > 0 and solution_count <= combos:
                            print("found good combo:", target_pieces, solution_count)
                            return target_pieces, puzzle_solution

                    except:
                        print("error")
        print("redy")


def load_block(target_pieces):
    for i, piece in enumerate(target_pieces):
        fig = plt.figure(figsize=(7, 7))
        ax = fig.add_subplot(1, 1, 1, projection="3d")
        ax.axis("off")
        block = generate_block(piece_coordinates[piece])

        ax.set_xlim(0, block.shape[0])
        ax.set_ylim(0, block.shape[1])
        ax.set_zlim(0, block.shape[2])  # Set the maximum height for the plot

        ax.voxels(
            block,
            facecolors=piece_colors[piece],
            edgecolor="gray",
        )

        plt.axis("off")
        plt.savefig(f"{piece}.png", transparent=True)
        plt.close(fig)


rotated_pieces = {}
for code, coordinate in piece_coordinates.items():
    rotated_pieces[code] = piece_variations(generate_piece(coordinate))

target_puzzle = [[0, 0], [0, 2], [1, 0], [1, 1], [1, 2], [2, 1], [2, 2], [3, 2]]
target_blocks = ["b4", "r4", "r3", "r1"]

count, solution = solve_puzzle(
    generate_basic_puzzle(target_puzzle, PUZZLE_HEIGHT),
    target_blocks,
)

plot_solutions(target_blocks, solution, count)
