import numpy as np
import matplotlib.pyplot as plt

def plot_heatmap(statistics):
    x_values = [stat.x for stat in statistics]
    y_values = [stat.y for stat in statistics]
    correct_counts = [stat.correct_count for stat in statistics]

    if not correct_counts:
        raise ValueError("correct_counts is empty, cannot compute max.")
    
    # Creating a 2D grid for the heatmap
    heatmap_data = np.array(correct_counts).reshape((max(x_values) + 1, max(y_values) + 1))

    plt.imshow(heatmap_data, cmap='hot', interpolation='nearest')
    plt.colorbar()
    plt.title('Heatmap of Correct Answers')
    plt.xlabel('Y Values')
    plt.ylabel('X Values')
    plt.show()
