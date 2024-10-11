import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import itertools

class DataFormatter:
    def __init__(self):
        pass

    def heatmap_data_formatter(self, data: list[dict[str, any]]):
        df = pd.DataFrame(data, columns=["x", "y", "incorrect_count", "correct_count"])
        df["correct_rate"] = df["correct_count"] / (df["incorrect_count"] + df["correct_count"]) 
        df = df[["x", "y", "correct_rate"]]

        # Generate all combinations of x and y
        all_combinations = pd.DataFrame(list(itertools.product(df['x'].unique(), df['y'].unique())), columns=['x', 'y'])
        df_full = all_combinations.merge(df, on=['x', 'y'], how="left")
        df_full['correct_rate'] = df_full['correct_rate'].fillna('-')

        df_sorted = df_full.sort_values(by=['x', 'y']).reset_index(drop=True)

        # Convert to JSON serializable format
        df_sorted_json = df_sorted.to_dict(orient="records")

        return df_sorted_json

    
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

