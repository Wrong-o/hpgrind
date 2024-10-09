import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import itertools

class DataFormatter:
    def __init__(self):
        pass

    def heatmap_data_formatter(self, data: list[dict[str, any]]):
        data = data
        df = pd.DataFrame(data, columns=["x", "y", "incorrect_count", "correct_count"])
        df["correct_rate"] = df["correct_count"] / (df["incorrect_count"]+ df["correct_count"]) 
        df = df[["x", "y", "correct_rate"]]
        all_combinations = pd.DataFrame(list(itertools.product(df['x'].unique(), df['y'].unique())), columns=['x', 'y'])
        df_full = all_combinations.merge(df, on =['x', 'y'], how="left")
        df_full['correct_rate'] = df_full['correct_rate'].fillna('-')
        
        df_sorted = df_full.sort_values(by=['x', 'y']).reset_index(drop=True)

        return df_sorted
    
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

