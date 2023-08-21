import numpy as np
from numpy import array
from itertools import permutations
import random

from components import *


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
    base = np.zeros((5, 5))
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
    solutions = []
    for piece in pieces:
        size_diff = [
            max(0, puzzle.shape[0] - piece.shape[0]) + 1,
            max(0, puzzle.shape[1] - piece.shape[1]) + 1,
            max(0, puzzle.shape[2] - piece.shape[2]) + 1,
        ]
        for shift_x in range(size_diff[0]):
            for shift_y in range(size_diff[1]):
                for shift_z in range(size_diff[2]):
                    still_fits = True
                    for i, j, k in np.ndindex(piece.shape):
                        if piece[i, j, k] == 1:
                            try:
                                if puzzle[i + shift_x, j + shift_y, k + shift_z] != 1:
                                    still_fits = False
                                    break
                            except IndexError:
                                still_fits = False
                                break
                    if still_fits:
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


def solve_puzzle(puzzle, target_pieces):
    """
    Takes a puzzle and a set of target pieces,
    returning all solutions with the solution count.
    """

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
                    _temp += piece_fits_puzzle(
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
        print(solution_count)
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


def find_good_combination(target_puzzle, piece_count=4):
    basic_puzzle = generate_basic_puzzle(target_puzzle, 2)
    puzzle_size = get_puzzle_size(basic_puzzle)
    piece_combinations = [
        list(i) for i in permutations(piece_coordinates.keys(), piece_count)
    ]

    def is_combination_valid(combination, target_size, piece_sizes):
        return sum(piece_sizes[piece] for piece in combination) == target_size

    valid_combinations = list(
        filter(
            lambda c: is_combination_valid(c, puzzle_size, piece_sizes),
            piece_combinations,
        )
    )
    random.shuffle(valid_combinations)

    print("looking at combinations of ", piece_count, "pieces")

    for combination in valid_combinations:
        try:
            solution_count, solution = solve_puzzle(basic_puzzle, combination)
            if solution_count > 0 and solution_count <= 5:
                return combination, solution
        except:
            pass


def find_good_combinations(target_puzzle, piece_count=4):
    basic_puzzle = generate_basic_puzzle(target_puzzle, 2)
    puzzle_size = get_puzzle_size(basic_puzzle)
    piece_combinations = [
        list(i) for i in permutations(piece_coordinates.keys(), piece_count)
    ]

    combos = []

    def is_combination_valid(combination, target_size, piece_sizes):
        return sum(piece_sizes[piece] for piece in combination) == target_size

    valid_combinations = list(
        filter(
            lambda c: is_combination_valid(c, puzzle_size, piece_sizes),
            piece_combinations,
        )
    )
    random.shuffle(valid_combinations)

    for combination in valid_combinations:
        try:
            solution_count, solution = solve_puzzle(basic_puzzle, combination)
            if solution_count > 0 and solution_count <= 5:
                combos.append(combination)
                print("solver combos:", combos)
                if len(combos) >= 2:
                    return combos
        except:
            pass
    return combos


rotated_pieces = {}
for code, coordinate in piece_coordinates.items():
    rotated_pieces[code] = piece_variations(generate_piece(coordinate))
