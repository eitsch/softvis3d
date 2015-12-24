/*
 * softvis3d-webservice-example
 * Copyright (C) 2015 Stefan Rinderle
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
package de.rinderle.softvis3d.neoresult;

import java.util.List;

/**
 * Created by stefanrinderle on 14.12.15.
 */
public class Results {

  private List<String> columns;

  private List<Data> data;

  public List<String> getColumns() {
    return columns;
  }

  public List<Data> getData() {
    return data;
  }

  @Override
  public String toString() {
    return "Results{" +
        "columns=" + columns +
        ", data=" + data +
        '}';
  }
}