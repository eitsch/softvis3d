/*
 * SoftViz3d Sonar plugin
 * Copyright (C) 2013 Stefan Rinderle
 * stefan@rinderle.info
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02
 */
package de.rinderle.softviz3d.layout.calc;

/**
 * Created by stefan on 05.11.14.
 */
public class VisualizationRequestDTO {

  private final int rootSnapshotId;

  private final LayoutViewType viewType;

  private final int footprintMetricId;
  private final int heightMetricId;

  public VisualizationRequestDTO(int rootSnapshotId, LayoutViewType viewType, int footprintMetricId, int heightMetricId) {
    this.rootSnapshotId = rootSnapshotId;

    this.viewType = viewType;

    this.footprintMetricId = footprintMetricId;
    this.heightMetricId = heightMetricId;
  }

  public int getRootSnapshotId() {
    return rootSnapshotId;
  }

  public LayoutViewType getViewType() {
    return viewType;
  }

  public int getFootprintMetricId() {
    return footprintMetricId;
  }

  public int getHeightMetricId() {
    return heightMetricId;
  }
}
